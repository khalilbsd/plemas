import { createMediaUrl } from "../../Utils/FileManager.js";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { UserProfile } from "../../db/relations.js";
import { UnauthorizedError } from "../../errors/http.js";
import logger from "../../log/config.js";
import { send } from "../../mails/config.js";
import User from "../../models/users/User.model.js";
import {
  createPasswordSetToken,
  encryptPassword,
  serializeProfile,
  serializeUser
} from "./lib.js";

/*
admin api to list all the users
*/
export const getAll = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: [
      "id",
      "email",
      "role",
      "isSuperUser",
      "isBanned",
      "active",
      "createdAt",
      "updatedAt"
    ],
    include: [
      {
        model: UserProfile,
        attributes: ["name", "lastName"]
      }
    ]
  });
  // console.log(users);
  const simplifiedUsers = users.map((user) => {
    const { id, email, role, isSuperUser, createdAt, updatedAt,isBanned,active } =
      user.toJSON();
    const userProfile = user.UserProfile ? user.UserProfile.toJSON() : null;
    const { name, lastName } = userProfile || "";
    return {
      id,
      email,
      role,
      isSuperUser,
      createdAt,
      updatedAt,
      name,
      lastName,
      isBanned,
active
    };
  });

  res.json({ users: simplifiedUsers });
});

export const addUser = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data || !data.account) {
    logger.error("there is no data in the request: ADMIN REQUESTED");
    return res.status(500).json({ message: "something went wrong" });
  }

  const newUser = data.account;

  const isUserExist = await getUserByEmail(newUser.email);
  if (isUserExist) {
    logger.error(`a user with the email " ${newUser.email} " already exists`);
    return res.status(403).json({ message: "user already exists" });
    // next(new AppError("user already exists", 403));
  }
  // password encryption
  let emailToken
  if (newUser.password) {
    const encrypted = await encryptPassword(newUser.password);
    newUser.password = encrypted;
  } else {
    //generate authentication token
    const token  = await createPasswordSetToken()




    newUser.token = token;

  }

  const isUserCreated = await User.create({ ...newUser });
  if (!isUserCreated)
    return next(new AppError("something went wrong when creation", 500));

  const { dataValues: user } = isUserCreated;

  logger.info(`user ${user.id} created successfully`);

  //creating a profile for the user created

  let userProfile;
  if (Object.keys(data?.profile).length) {
    userProfile = await createUserProfile(data.profile, user.id);
    if (!userProfile)
      return next(
        new AppError("Something wrong with the profile creation", 500)
      );
    logger.info(`userProfile ${userProfile.id} created successfully`);
  }

  if (user.token) {
    logger.info(`sending email confirmation for user ${user.id}`);
    const url = `http://${process.env.LMS_HOST}/auth/account/confirmation/${user.token}`;
    try {
      await send({
        template: "account_verification_token",
        to: user.email,
        subject: `Account Verification Link (valid for ${
          process.env.VERIF_TOKEN_EXPIRES_IN / 60000
        } min)`,
        args: { url }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const createdUSer = serializeUser(user);
  if (userProfile) {
    createdUSer.id = user.id;
    createdUSer.name = userProfile.name;
    createdUSer.lastName = userProfile.lastName;
  }

  res.status(200).json({ message: "user created successfully", createdUSer });
});

export const createUserProfile = async (info, userId) => {
  if (!userId || !info) return null;
  const profile = serializeProfile(info, userId);

  if (!profile) return null;
  const newProfile = await UserProfile.create({ ...profile });

  if (!newProfile) return null;

  return newProfile.dataValues;
};

export const getUserInfo = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("an email must be provided", 500));

  const user = await getUserByEmail(email);
  if (!user) {
    const msg = `there is no such user holding this email : ${email} `;
    logger.error(msg);
    return next(new ElementNotFound(msg));
  }

  return res.status(200).json({
    status: "success",
    user: serializeUser(user),
    profile: serializeProfile(user.UserProfile)
  });
});

// export const getUserByEmail = async (email) => {
//   if (!email) return null;
//   const user = await User.findOne({
//     where: { email: email,isBanned:false },
//     include: UserProfile
//   });
//   if (user) return user;

//   return null;
// };
export const getUserByEmail = async (email,includeProfile = true) => {
  if (!email) return null;

  const queryOptions = {
    where: { email: email, isBanned: false },
  };

  // Conditionally include the UserProfile relation based on includeProfile parameter
  if (includeProfile) {
    queryOptions.include = UserProfile;
  }

  const user = await User.findOne(queryOptions);

  if (user) return user;

  return null;
};

export const getUserByID = async (id) => {
  if (!id) return null;
  const user = await User.findByPk(id);
  if (!user) return null;

  return user;
};

export const updateProfile = catchAsync(async (req, res, next) => {
  // const { userId } = req.params;

  const newProfile = req.body;
  if (!newProfile.email)
    return next(new AppError("The email was not provided", 500));

  if (!req.user.isSuperUser) {
    if (newProfile.email != req.user.email)
      return next(new UnauthorizedError());
  }
  const user = await User.findOne({ where: { email: newProfile.email } });
  if (!user) {
    const errorMsg = `the user : ${newProfile.email} is not found`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }

  const userProfile = await UserProfile.findOne({ where: { userId: user.id } });
  if (!userProfile) {
    const errorMsg = `UserProfile for user ${newProfile.email} is not found`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }
  await userProfile.update({ ...newProfile });
  await userProfile.save();
  res
    .status(200)
    .json({ status: "success", message: "user profile updated successfully" });
});

export const updateProfileImage = catchAsync(async (req, res, next) => {
  if (!req.user.isSuperUser) {
    if (req.body.email !== req.user.email) return next(new UnauthorizedError());
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    const errorMsg = `the user : ${req.body.email} is not found`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }
  const userProfile = await UserProfile.findOne({ where: { userId: user.id } });
  if (!userProfile) {
    const errorMsg = `UserProfile for user ${newProfile.email} is not found`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }
  let url;
  if (!req.file) return next(new AppError("no file has been provided", 500));


  // console.log("request file size",req.file.size,"is above 5mo",req.file.size > 5 * 1024 * 1024);

  if (req.file.size > 5 * 1024 * 1024)
    return next(new AppError("file exceeds the limit of 5MB", 500));
  if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
    removeTmp(req.file.tempFilePath);
    return res.status(400).json({ msg: "File format is incorrect." });
  }
  // url = await createMedia(req.user._id, '/users/', req.file.buffer);
  url = createMediaUrl(req.file);
  userProfile.image = url;
  userProfile.save();
  return res
    .status(200)
    .json({ status: "success", message: "profile image updated successfully",url});
});

export const authenticateUserWithToken = catchAsync(async (req, res, next) => {

  const { token } = req.params;

  if (!token) return next(new ElementNotFound("Token was not supplied"));
  //check if  token is valid : 16 bytes and HEX format
  const isValidToken = /^[a-zA-Z0-9+/]+={0,2}$/.test(token);

  if (!isValidToken)
    return next(new MalformedObjectId("token maybe malformed "));

//we need to decrypt the public token to match the private token


  const user = await User.findOne({
    where: {
      token: token,
      active: false,
      isBanned: false,
      password: null
    }
  });

  if (!user) return next(new ElementNotFound("no such user"));
  //validate the token and erase it
  res.status(200).json({ message: "token validated: Welcome", email:user.email});
});





