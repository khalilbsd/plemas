import { Op } from "sequelize";
import { createMediaUrl } from "../../Utils/FileManager.js";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import {
  CLIENT_ROLE,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../constants/constants.js";
import { UserProfile } from "../../db/relations.js";
import { config } from "../../environment.config.js";
import { UnauthorizedError } from "../../errors/http.js";
import logger from "../../log/config.js";
import { send } from "../../mails/config.js";
import User from "../../models/users/User.model.js";
import {
  createPasswordSetToken,
  encryptPassword,
  getUserByEmail,
  serializeProfile,
  serializeUser
} from "./lib.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";

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
    const {
      id,
      email,
      role,
      isSuperUser,
      createdAt,
      updatedAt,
      isBanned,
      active
    } = user.toJSON();
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

export const getPotentielProjectManager = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      isBanned: false,
      [Op.or]: [{ role: SUPERUSER_ROLE }, { role: PROJECT_MANAGER_ROLE }]
    },
    attributes: ["id", "email"],
    include: [
      {
        model: UserProfile,
        attributes: ["name", "lastName", "image", "poste"]
      }
    ]
  });
  // console.log(users);
  const simplifiedUsers = users.map((user) => {
    const { id, email } = user.toJSON();
    const userProfile = user.UserProfile ? user.UserProfile.toJSON() : null;
    const { name, lastName, image, poste } = userProfile || "";
    return {
      id,
      email,
      lastName,
      name,
      image,
      poste
    };
  });

  res.json({ users: simplifiedUsers });
});

export const getPotentielIntervenants = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const objectQuery = {
    isBanned: false,
    role: { [Op.ne]: CLIENT_ROLE }
  };
  const existingIntervenants = await Intervenant.findAll({
    where: { projectID: projectID },
    attributes: ["intervenantID"]
  });
  if (existingIntervenants) {
    let list = [];
    existingIntervenants.forEach((inter) => {
      list.push(inter.intervenantID);
    });
    objectQuery.id = {
      [Op.notIn]: list
    };
  }

  const users = await User.findAll({
    where: objectQuery,
    attributes: ["id", "email"],
    include: [
      {
        model: UserProfile,
        attributes: ["name", "lastName", "image", "poste"]
      }
    ]
  });
  const simplifiedUsers = users.map((user) => {
    const { id, email } = user.toJSON();
    const userProfile = user.UserProfile ? user.UserProfile.toJSON() : null;
    const { name, lastName, image, poste } = userProfile || "";
    return {
      id,
      email,
      lastName,
      name,
      image,
      poste
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
  let emailToken;
  if (newUser.password) {
    const encrypted = await encryptPassword(newUser.password);
    newUser.password = encrypted;
  } else {
    //generate authentication token
    const token = await createPasswordSetToken();

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
  console.log(config.lms_host);

  if (user.token) {
    logger.info(`sending email confirmation for user ${user.id}`);
    const url = `http://${config.lms_host}/auth/account/confirmation/${user.token}`;
    try {
      await send({
        template: "account_verification_token",
        to: user.email,
        subject: `Account Verification Link (valid for ${
          config.verify_token_expires_in / 60000
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

/*
 *  get user By id : return the user if found or null
 * @param {*} id
 * @returns
 */
export const getUserByID = async (id) => {
  if (!id) return null;
  const user = await User.findByPk(id);
  if (!user) return null;

  return user;
};

/**
 update user profile : accepts all the fields of the user
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  // const { userId } = req.params;

  const newProfile = req.body;
  console.log(newProfile);

  const user = await User.findOne({
    where: { email: newProfile.email || req.user.email }
  });
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
/**
 update user image  : this is a standalone api  to lighten up the request
 */
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
  url = createMediaUrl(req.file);
  userProfile.image = url;
  userProfile.save();
  return res.status(200).json({
    status: "success",
    message: "profile image updated successfully",
    url
  });
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
  res
    .status(200)
    .json({ message: "token validated: Welcome", email: user.email });
});

/**
 * this api is to change the user role
 * accepts  email and role
 */
export const changeUserRole = catchAsync(async (req, res, next) => {
  const { email, role } = req.body;
  if ((!email, !role))
    return next(new MissingParameter("the email and role are mandatory"));
  //check if role exists : for now the list of roles is hardcode in server/constant
  if (
    ![
      SUPERUSER_ROLE,
      INTERVENANT_ROLE,
      PROJECT_MANAGER_ROLE,
      CLIENT_ROLE
    ].includes(role)
  )
    return next(new ElementNotFound("roles doesn't exist"));

  const user = await getUserByEmail(email);
  if (!user) return next(new ElementNotFound("User not found"));

  if (role === SUPERUSER_ROLE) {
    user.isSuperUser = true;
  } else {
    user.isSuperUser = false;
  }
  user.role = role;

  user.save();

  return res.status(200).json({
    status: "success",
    message: "The user role has been updated successfully "
  });
});

/**
 * ban user api : this api will deactivate the user if it's active  otherwise a  404 will returned
 * if the user is not found  || the user is already banned
 */
export const banUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new MissingParameter("Email is mandatory"));

  const user = await getUserByEmail(email, false, false);
  if (!user) return next(new ElementNotFound("User not found"));
  user.isBanned = true;
  user.save();

  return res
    .status(200)
    .json({ state: "success", message: `user ${email} has been banned` });
});

/**
 * un ban user api : this api will activate the user if it's banned otherwise a  404 will returned
 * if the user is not found  || the user is already active
 */
export const unBanUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new MissingParameter("Email is mandatory"));

  const user = await getUserByEmail(email, false, true);
  if (!user)
    return next(new ElementNotFound("User not found or is already unbanned"));
  user.isBanned = false;
  user.save();

  return res
    .status(200)
    .json({ state: "success", message: `user ${email} has been unbanned` });
});
