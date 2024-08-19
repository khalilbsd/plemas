import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import logger from "../../log/config.js";
import { getRSAPublicKey } from "../../utils/utils.js";
// import { User, UserProfile } from "../../db/relations.js";
import { config } from "../../config/environment.config.js";
import {
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../constants/constants.js";
import User from "../../models/users/User.model.js";
import UserProfile from "../../models/users/UserProfile.model.js";
import { AppError, MalformedObjectId } from "../../utils/appError.js";
import { createMediaUrl } from "../../utils/FileManager.js";

export const changeUserDate = async (userData, user) => {
  try {
    delete userData.email;
    delete userData.password;
    delete userData.role;
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { ...userData }
    );
    return updatedUser;
  } catch (err) {
    logger.error(`error updating the user because ${err}`);
    return null;
  }
};

export const createUser = async (account, profile, next) => {
  try {
    // password encryption
    if (account.password) {
      const encrypted = await encryptPassword(account.password);
      account.password = encrypted;
    } else {
      //generate authentication token
      const token = await createPasswordSetToken();
      account.token = token;
    }
    //check role
    account.isSuperUser = account.role === SUPERUSER_ROLE;
    account.profile = profile;
    //user account creation

    account.profile = new UserProfile({ ...profile });
    const user = await User.create({ ...account });
    if (!user)
      return next(
        new AppError("quelque chose n'a pas fonctionné when creation", 500)
      );
    // const { dataValues: user } = isUserCreated;
    logger.info(`user ${user.id} created successfully`);
    await user.profile.save();

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
    if (user.profile) {
      createdUSer.id = user.id;
      createdUSer.name = user.profile.name;
      createdUSer.lastName = user.profile.lastName;
    }

    return createdUSer;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

//static routes

// const currentFilePath = new URL(import.meta.url).pathname;

export const encryptPassword = async (password) => {
  const hashed = await bcrypt.hash(
    password,
    parseInt(config.salt_rounds_bcrypt)
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

export const serializeSimpleUserObject = (user) => {
  let fullName = "";
  if (user?.UserProfile.name) fullName += user?.UserProfile.name;
  if (user?.UserProfile.lastName) fullName += ` ${user?.UserProfile.lastName}`;

  return {
    email: user.email,
    image: user?.UserProfile?.image,
    fullName
  };
};

export const serializeProfile = (userInfo, userId) => {
  return {
    name: userInfo.name,
    lastName: userInfo.lastName,
    poste: userInfo.poste,
    phone: userInfo.phone,
    image: userInfo.image,
    address: userInfo.address ? userInfo.address : "",
    // city: userInfo.city ? userInfo.city : "",
    // street: userInfo.street ? userInfo.street : "",
    // region: userInfo.region ? userInfo.region : "",

    hireDate: userInfo.hireDate,
    userID: userId
  };
};

export const generateToken = async (userID) => {
  return jwt.sign({ userID }, config.jwt_secret, {
    expiresIn: config.jwt_expires_in
  });
};

export const createPasswordSetToken = async () => {
  /* @ DESC:: creating to double edge tokens one to send  and one to save
   */
  //accessing the key pairs
  const publicKey = await getRSAPublicKey();
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
  return tokenToSave.substring(0, 128);
};

/**
 * returns the user by email
 */

/*
 *  get user By id : return the user if found or null
 * @param {*} id
 * @returns
 */
export const getUserByEmail = async (
  email,
  includeProfile = true,
  withBanned = false
) => {
  if (!email) return null;
  const queryOptions = { email: email, isBanned: withBanned };
  let user;
  if (includeProfile) {
    user = await User.findOne(queryOptions).populate("profile").exec();
  } else {
    user = await User.findOne(queryOptions).exec();
  }
  if (user) return user;

  return null;
};

/**
 * this will detemrine if the user is either a superuser or project Manager
 */
/**
 * This function checks if the user is either a superuser or a project manager.
 *
 * @param {Object} user - The user object to be checked.
 * @returns {Boolean} - Returns true if the user is a superuser or a project manager, otherwise false.
 */
export function isUserManagement(user) {
  return (
    (user.isSuperUser && user.role === SUPERUSER_ROLE) ||
    user.role === PROJECT_MANAGER_ROLE
  );
}

export const getUsersList = async () => {
  try {
    return await User.find().populate("profile").exec();
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const getRetrievePotentialProjectManagers = async () => {
  try {
    const users = await User.find(
      {
        isBanned: false,
        $or: [{ role: SUPERUSER_ROLE }, { role: PROJECT_MANAGER_ROLE }]
      },
      { _id: 1, email: 1 }
    )
      .populate("profile", { _id: 0, name: 1, lastName: 1, image: 1, poste: 1 })
      .exec();

    const simplifiedUsers = users.map((user) => {
      const { id, email, profile } = user.toJSON();

      const { name, lastName, image, poste } = profile || "";
      return {
        id,
        email,
        lastName,
        name,
        image,
        poste
      };
    });

    return simplifiedUsers;
  } catch (error) {
    console.log(error);
    return null;
  }
};
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

export const updateUserProfile = async (user, userData) => {
  try {
    console.log(user);
    const profile = await UserProfile.findOneAndUpdate(
      { _id: user.profile._id },
      { ...userData }
    );
    return profile;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const toggleUserBan = async (email, ban) => {
  try {
    const user = await User.findOneAndUpdate({ email }, { isBanned: ban });
    return user;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const changeProfileImage = async (req, user, next) => {
  try {
    let url;
    // console.log(req.file,req.files);
    const image = req.files[0];
    if (!image) return next(new AppError("aucun fichier n'a été fourni", 500));

    // console.log("request file size",req.file.size,"is above 5mo",req.file.size > 5 * 1024 * 1024);

    if (image.size > 5 * 1024 * 1024)
      return next(new AppError("le fichier dépasse la limite de 5MB", 400));
    if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png") {
      // removeTmp(req.file.tempFilePath);
      return next(new AppError("Le format du fichier est incorrect.", 400));
    }
    url = createMediaUrl(image);
    console.log(url);
    user.profile.image = url;

    await user.profile.save();
  } catch (error) {}
};

export const getUserByToken = async (token) => {
  const isValidToken = /^[a-zA-Z0-9+/]+={0,2}$/.test(token);

  if (!isValidToken)
    return next(new MalformedObjectId("le jeton est peut-être mal formé "));

  //we need to decrypt the public token to match the private token

  const user = await User.findOne({
    token: token,
    active: false,
    isBanned: false,
    password: null
  });
  return user;
};




