import {
  CLIENT_ROLE,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  STATUS_SUCCESS,
  SUPERUSER_ROLE
} from "../../constants/constants.js";
import logger from "../../log/config.js";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter
} from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
// import Intervenant from "../../models/tasks/Intervenant.model.js";
import { messages } from "../../i18n/messages.js";
import User from "../../models/users/User.model.js";
import UserProfile from "../../models/users/UserProfile.model.js";
import {
  changeProfileImage,
  changeUserDate,
  createUser,
  getRetrievePotentialProjectManagers,
  getUserByEmail,
  getUserByToken,
  getUsersList,
  serializeProfile,
  serializeUser,
  toggleUserBan,
  updateUserProfile
} from "../../services/users/user.service.js";
import { projectPotentialIntervenants } from "../../services/intervenants/intervenant.service.js";
/*
admin api to list all the users
*/
export const addUser = catchAsync(async (req, res, next) => {
  const { account, profile } = req.body;
  if (!account) {
    logger.error("there is no data in the request: ADMIN REQUESTED");
    return res.status(500).json({ message: messages.something_went_wrong });
  }

  const isUserExist = await getUserByEmail(account.email);
  if (isUserExist) {
    logger.error(`a user with the email " ${account.email} " already exists`);
    return res.status(403).json({ message: "utilisateur déjà existant" });
    // next(new AppError("user already exists", 403));
  }
  const createdUSer = await createUser(account, profile, next);
  if (!createdUSer) {
    return next(
      new AppError("quelque chose n'a pas fonctionné when creation", 500)
    );
  }
  return res
    .status(200)
    .json({ message: "utilisateur créé avec succès", createdUSer });
});

/*
admin api to list all the users
*/
export const getAll = catchAsync(async (req, res, next) => {
  let users = await getUsersList();

  return res.status(200).json(users);
});

export const getUserInfo = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("un email doit être fourni", 500));

  const user = await getUserByEmail(email);
  if (!user) {
    const msg = `il n'y a pas d'utilisateur détenant cet email : ${email} `;
    logger.error(msg);
    return next(new ElementNotFound(msg));
  }

  return res.status(200).json({
    status: "success",
    user: serializeUser(user),
    profile: serializeProfile(user.profile)
  });
});



/**
 update user profile : accepts all the fields of the user
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  // const { userId } = req.params;

  const newProfile = req.body;
  const email = newProfile.email || req.user.email;
  const user = await getUserByEmail(email);

  if (!user) {
    const errorMsg = `the user : ${newProfile.email} is not found`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }

  const isUpdated = await updateUserProfile(user, newProfile);
  if (!isUpdated) return next(new AppError(messages[500], 500));
  return res.status(200).json({
    status: "success",
    message: "le profil de l'utilisateur a été mis à jour avec succès"
  });
});

/**
 * ban user api : this api will deactivate the user if it's active  otherwise a  404 will returned
 * if the user is not found  || the user is already banned
 */
export const banUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new MissingParameter("L'e-mail est obligatoire"));
  const isBanned = await toggleUserBan(email, true);
  if (!isBanned) return next(new ElementNotFound(messages["user_not_found"]));
  return res
    .status(200)
    .json({ state: "success", message: `l'utilisateur ${email} a été banni` });
});

/**
 * un ban user api : this api will activate the user if it's banned otherwise a  404 will returned
 * if the user is not found  || the user is already active
 */
export const unBanUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new MissingParameter("L'e-mail est obligatoire"));
  const isBanned = await toggleUserBan(email, false);
  if (!isBanned) return next(new ElementNotFound(messages["user_not_found"]));

  return res.status(200).json({
    state: "success",
    message: `l'utilisateur ${email} a été débanni`
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  if (!email) return next(new MissingParameter(messages.email_is_missing));
  const user = await getUserByEmail(email);
  if (!user) return next(new ElementNotFound(messages.user_not_found_1));
  const updatedUser = await changeUserDate(req.body, user);
  if (!updatedUser) return next(new AppError(messages.no_changes_made, 304));
  return res.status(200).json({
    status: STATUS_SUCCESS,
    user: updatedUser,
    message: messages.user_account_updated
  });
});

/**
 update user image  : this is a standalone api  to lighten up the request
 */
export const updateProfileImage = catchAsync(async (req, res, next) => {
  const user = getUserByEmail(req.user.email);
  if (!user) {
    const errorMsg = `l'utlisateur : ${req.body.email} est inrouvable`;
    logger.error(errorMsg);
    return next(new ElementNotFound(errorMsg));
  }
  const url = await changeProfileImage(req, user, next);
  return res.status(200).json({
    status: "success",
    message: "l'image de profil a été mise à jour avec succès",
    url
  });
});

export const authenticateUserWithToken = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) return next(new ElementNotFound("Le jeton n'a pas été fo"));
  //check if  token is valid : 16 bytes and HEX format
  const user = await getUserByToken(token)

  if (!user) return next(new ElementNotFound("aucun utilisateur de ce type"));
  //validate the token and erase it
  res
    .status(200)
    .json({ message: "jeton validé : Bienvenue", email: user.email });
});

/**
 * this api is to change the user role
 * accepts  email and role
 */
export const changeUserRole = catchAsync(async (req, res, next) => {
  const { email, role } = req.body;
  if ((!email, !role))
    return next(
      new MissingParameter(
        "l'adresse électronique et le rôle sont obligatoires"
      )
    );
  //check if role exists : for now the list of roles is hardcode in server/constant
  if (
    ![
      SUPERUSER_ROLE,
      INTERVENANT_ROLE,
      PROJECT_MANAGER_ROLE,
      CLIENT_ROLE
    ].includes(role)
  )
    return next(new ElementNotFound("le rôle n'existent pas"));

  const user = await getUserByEmail(email);
  if (!user) return next(new ElementNotFound("Utilisateur non trouvé"));

  if (role === SUPERUSER_ROLE) {
    user.isSuperUser = true;
  } else {
    user.isSuperUser = false;
  }
  user.role = role;

  await user.save();

  return res.status(200).json({
    status: "success",
    message: messages["user_role_updated_successfully"]
  });
});

export const getPotentielProjectManager = catchAsync(async (req, res, next) => {
  const users = await getRetrievePotentialProjectManagers();
  if (!users) return next(new AppError(500, messages[500]));
  return res.json({ users: simplifiedUsers });
});

// export const getPotentielIntervenants = catchAsync(async (req, res, next) => {
//   const { projectID } = req.params;
//   if (!projectID) return next(new MissingParameter("le projet est requis"));
//   const simplifiedUsers = await projectPotentialIntervenants(projectID);
//   return res.json({ users: simplifiedUsers });
// });



