import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ElementNotFound } from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { serializeUser } from "../users/lib.js";
import { getUserByEmail } from "../users/user.controller.js";

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

export const passwordReset = (req, res, next) => {};
