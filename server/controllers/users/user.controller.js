import { AppError } from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import logger from "../../log/config.js";
import User from "../../models/users/User.model.js";
import { encryptPassword } from "./lib.js";

export const getAll = catchAsync(async (req, res, next) => {
  const users = await User.findAll();
  res.json(users);
});

export const addUser = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data) {
    res.status(500).json({ message: "something went wrong" });
    logger.error("something went wrong");
  }
  const isUserExist = await getUserByEmail(data.email);
  if (isUserExist){
        logger.error(`a user with the email " ${data.email} " already exists`)
      return next(new  AppError('user already exists',403))
  }
  // password encryption
  if (data.password){
      const encrypted = await encryptPassword(data.password)
      data.password = encrypted
  }
  await User.create({ ...data });
  logger.info("user created successfully");
  res.status(200).json({ message: "user created successfully" });
});





export const getUserByEmail =async(email)=>{
  console.log("get user by email",email);
  if (!email) return null
  const user = await User.findOne({ where: { email: email } });
  if (user) return user

  return null

}

export const getUserByID =async (id)=>{
  if (!id) return null
  const user = await User.findByPk(id)
  if (!user) return null

  return user


}