import { AppError } from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { UserProfile } from "../../db/relations.js";
import logger from "../../log/config.js";
import User from "../../models/users/User.model.js";
import { encryptPassword, serializeProfile, serializeUser } from "./lib.js";

export const getAll = catchAsync(async (req, res, next) => {
  const users = await User.findAll();
  res.json({ data: users });
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
    return next(new AppError("user already exists", 403));
  }
  // password encryption
  if (newUser.password) {
    const encrypted = await encryptPassword(newUser.password);
    newUser.password = encrypted;
  }
  const isUserCreated = await User.create({ ...newUser });
  if (!isUserCreated)
    return next(new AppError("something went wrong when creation", 500));

  const { dataValues: user } = isUserCreated;

  logger.info(`user ${user.id} created successfully`);
  //creating a profile for the user created

  if (Object.keys(data?.profile).length) {
    const userProfile = await createUserProfile(data.profile, user.id);
    if (!userProfile)
      return next(
        new AppError("Something wrong with the profile creation", 500)
      );
    logger.info(`userProfile ${userProfile.id} created successfully`);
  }

  res.status(200).json({ message: "user created successfully" });
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

  return res.status(200).json({ status: "success", user: serializeUser(user) ,profile:serializeProfile(user.UserProfile) });
});




export const getUserByEmail = async (email) => {

  if (!email) return null;
  const user = await User.findOne({ where: { email: email } ,include:UserProfile});
  if (user) return user;

  return null;
};

export const getUserByID = async (id) => {
  if (!id) return null;
  const user = await User.findByPk(id);
  if (!user) return null;

  return user;
};
