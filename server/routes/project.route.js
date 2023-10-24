import express from "express";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js";
import {
  addProject,
  generateProjectCode,
  getAllProjects,
  updateProjectDetails,
  //   changeProjectPhase,
  getProjectsInPhase,
  checkProjectCode,
  checkProjectLinking,
  getProjectById
} from "../controllers/projects/project.controller.js";
import { CLIENT_ROLE, SUPERUSER_ROLE } from "../constants/constants.js";

const router = express.Router();

router
  .get(
    "/all",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    getAllProjects
  )
  .get(
    "/creation/choice",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    checkProjectLinking
  )
  .get(
    "/phase/activated",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    getProjectsInPhase
  )
  .get(
    "/generate/code",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    generateProjectCode
  )
  .post(
    "/verify/code/",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    checkProjectCode
  )
  .post(
    "/add",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    addProject
  )
  .patch(
    "/change/:projectID",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    updateProjectDetails
  )

  .get(
    "/get/project/:projectID",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, CLIENT_ROLE]),
    getProjectById
  );
// .patch('/change/project/:custom_name/phase',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),changeProjectPhase)
export default router;
