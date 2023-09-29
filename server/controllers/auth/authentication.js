import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  AppError,
  ElementNotFound,
  UnAuthorized,
  UnknownError
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { encryptPassword, serializeUser } from "../users/lib.js";
import { getUserByEmail } from "../users/user.controller.js";
import User from "../../models/users/User.model.js";
import logger from "../../log/config.js";

dotenv.config();

export const login = catchAsync(async (req, res, next) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    res
      .status(404)
      .json({ state: "failed", message: "email or password is incorrect " });
    return next(new ElementNotFound("email is incorrect"));
  }
  //maybe adding a blocking detecting algo

  //to manage role redirection later for now static route
  const redirectUrl = "/main";
  const isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);
  if (user && isPasswordMatch) {
    // generate new token
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        isSuperUser: user.isSuperUser
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      message: "You have successfully logged in",
      user: serializeUser(user),
      token: `Bearer ${token}`,
      expiresIn: "2d",
      redirectUrl: redirectUrl
    });
  } else {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false
    });
  }
});

export const setUserPassword = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError("something went wrong", 500));

  const { isReseted, user } = await resetUserPassword(req, res);

  if (!isReseted || !user) return next(new UnknownError("something wen wrong"));

  user.token = null;
  user.active = true;

  user.save();
  return res.status(200).json({
    status: "success",
    message: "user password has been set and account activated"
  });
});

const resetUserPassword = async (req, res,userEmail=null) => {
  try {
    let response ={
      isReseted: null,
      user:null
    }
    const {  password, confirmPassword } = req.body;
    const email = req.body.email || userEmail

    const user = await User.findOne({
      where: { email: email, isBanned: false }
    });


    if (!user) {
      logger.error("user was not found ", email);
      return  response;
    }


    if (!email || !password || !confirmPassword) {
      logger.error("one of the parameters is not found");
      return response;
    }
    if (password !== confirmPassword) {
      logger.error("password doesn't match ");
      return response;
    }

    const encrypted = await encryptPassword(password);
    user.password = encrypted;
    // console.log("user password", encrypted);
    // const
     response.isReseted=true
     response.user=user

    return response;
  } catch (error) {
    logger.error(error);
  }
  // if (password )
};

export const passwordReset = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword)
    return next(new MissingParameter("passwords don't match "));

  if (password !== confirmPassword)
    return next(new AppError("passwords don't match", 500));

  const {user,isReseted} = await resetUserPassword(req,res,req.user.email)


  if (!user || !isReseted) return next(new UnknownError("something went wrong"))

  user.save()
  logger.info(`user ${req.user.email} changes his password successfully`)

  return res.status(200).json({isChanged:true,message:"password changed  successfully"})


});

export const checkUserPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const currentPassword = req.body.currentPassword;
  if (!currentPassword) return next(new AppError("no password has been specified", 400));

  const user = await User.findOne({
    where: { email: req.user.email },

    attributes: ["password", "email"]
  });
  if (!user) return next(new UnAuthorized());

  // check if the current  password is true
  const isPasswordMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordMatch)
    return res
      .status(403)
      .json({ matched: false, message: "current password doesn't match" });

  return res
    .status(200)
    .json({ matched: true, message: "current password is true" });
});
