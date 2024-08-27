import {
  ALL_ROLES,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE,
} from "constants/constants";
import express from "express";
import { checkUserRole, isUserAuthenticated } from "middleware/auth";
import {
  checkProjectLinking,
  getProjectsInPhase,
  generateProjectCode,
  checkProjectCode,
  addProject,
  updateProjectDetails,
  getProjectById,
  getProjectTracking,
  getAllIntervenants,
  removeIntervenantFromProject,
  assignManagerHoursBulk,
  abandonOrResumeProject,
  getAllProjects,
  addIntervenantToProject,
} from "controllers/projects/project.controller";
import { validateFields } from "middleware/validator";
import { messages } from "i18n/messages";
import {
  isCodeReceived,
  isNameReceived,
  isStartDateReceived,
} from "./validators";

const router = express.Router();

router
  .get("/all", isUserAuthenticated, checkUserRole(ALL_ROLES), getAllProjects)
  .get(
    "/creation/choice",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    checkProjectLinking
  )
  .get(
    "/phase/activated",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    getProjectsInPhase
  )
  .get(
    "/generate/code",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    generateProjectCode
  )
  .post(
    "/verify/code/",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    validateFields([isCodeReceived()],messages.existing_project_code),
    checkProjectCode
  )
  .post(
    "/add",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    validateFields(
      [isNameReceived(), isStartDateReceived(), isCodeReceived()],
      messages.required_fields
    ),
    addProject
  )
  .patch(
    "/change/:projectID",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    updateProjectDetails
  )

  .get(
    "/get/project/:projectID",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getProjectById
  )
  .get(
    "/get/project/:projectID/tracking",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    getProjectTracking
  )
  // .patch('/change/project/:custom_name/phase',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),changeProjectPhase)
  .get(
    "/intervenants/:projectID",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getAllIntervenants
  )
  .post(
    "/intervenants/:projectID/add",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    addIntervenantToProject
  )
  .delete(
    "/intervenants/:projectID/remove",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    removeIntervenantFromProject
  )
  .patch(
    "/change/manager/assign/hours/bulk",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    assignManagerHoursBulk
  )
  .patch(
    "/abandon/project/:projectID",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    abandonOrResumeProject
  );

export default router;
