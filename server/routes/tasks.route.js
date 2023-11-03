import { Router } from "express";
import {
    ALL_ROLES,
    INTERVENANT_ROLE,
    PROJECT_MANAGER_ROLE,
    SUPERUSER_ROLE
} from "../constants/constants.js";
import {
    associateIntervenantToTask,
    createTask,
    getDailyTasks,
    getProjectTasks,
    getTaskPotentialIntervenants,
    updateIntervenantHours
} from "../controllers/tasks/task.controller.js";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js";

const router = Router();

router
  .get(
    "/project/:projectID/all",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getProjectTasks
  )
  .get(
    "/daily/all",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getDailyTasks
  )
  .post(
    "/project/:projectID/create",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    createTask
  )
  .patch(
    "/project/:projectID/associate/intervenants",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE, INTERVENANT_ROLE]),
    associateIntervenantToTask
  )
  .patch(
    "/project/:projectID/intervenant/working/hours",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE, INTERVENANT_ROLE]),
    updateIntervenantHours
  )
  .patch(
    "/project/:projectID/potential/task/intervenants/list",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    getTaskPotentialIntervenants
  );

export default router;
