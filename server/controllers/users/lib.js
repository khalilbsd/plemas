import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { getRSAPublicKey } from "../../Utils/utils.js";

//static routes



// const currentFilePath = new URL(import.meta.url).pathname;


export const encryptPassword = async (password) => {
  const hashed = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS_BCRYPT)
  );
  return hashed;
};

export const serializeUser = (user) => {
  return {
    email: user.email,
    role: user.role,
    isSuperUser: user.isSuperUser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const serializeProfile = (userInfo, userId) => {
  return {
    name: userInfo.name,
    lastName: userInfo.lastName,
    poste: userInfo.poste,
    phone: userInfo.phone,
    image: userInfo.image,
    userID: userId
  };
};

export const generateToken = async (userID) => {
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const createPasswordSetToken = async () => {
  /* @ DESC:: creating to double edge tokens one to send  and one to save
   */
  //accessing the key pairs
  const publicKey = await getRSAPublicKey()
  //creating  a random bytes to  generate send token
  const tokenToSend = crypto.randomBytes(32).toString("hex");


  // Encrypt the token ,using the public key (for tokenToSave)
  const encryptedToken = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    tokenToSend
  );

  // Convert the encrypted token to a hexadecimal string
  const tokenToSave = encryptedToken.toString("hex");

  // const passwords = { tokenToSend, tokenToSave };
  return tokenToSave.substring(0,128);
};
