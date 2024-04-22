import express from "express";
import {
  addUser,
  getAll,
  updateUser,
  updateProfile,
  updateProfileImage,
  authenticateUserWithToken,
  changeUserRole,
  banUser,
  unBanUser,
  getPotentielProjectManager,
  // getPotentielIntervenants,
  getUserInfo
} from "../controllers/users/user.controller.js";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js";
// import uploader from '../middleware/imageUploader.js'
import { SUPERUSER_ROLE,PROJECT_MANAGER_ROLE } from "../constants/constants.js";
import createMulterMiddleware from "../middleware/uploader.js";

const router = express.Router();

const profileImageUploader = createMulterMiddleware("profileImage");

router
.get("/list", isUserAuthenticated, checkUserRole([SUPERUSER_ROLE]), getAll)
  .post("/add", addUser)
  .post("/user_info", isUserAuthenticated, getUserInfo)
  // .patch(
  //   "/change/:email",
  //   isUserAuthenticated,
  //   checkUserRole([SUPERUSER_ROLE]),
  //   updateUser
  // )
  .patch(
    "/profile/change",
    isUserAuthenticated,
    profileImageUploader,
    updateProfile
  )
  .patch(
    "/profile/image/change",
    isUserAuthenticated,
    profileImageUploader,
    updateProfileImage
  )
  .get("/confirmation/auth/1.0/token=:token", authenticateUserWithToken)
  .patch(
    "/change/user/role",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    changeUserRole
  )
  .patch(
    "/ban/user/deactivate",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    banUser
  )
  .patch(
    "/ban/user/activate",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    unBanUser
  )
  .get(
    "/potentiel/manger/list",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    getPotentielProjectManager
  )
  // .get(
  //   "/potentiel/intervenants/:projectID/list",
  //   isUserAuthenticated,
  //   checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
  //   getPotentielIntervenants
  // );
export default router;
