import { Router } from "express";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth";
import { ALL_ROLES } from "../constants/constants";
import { addIntervenantToProject, getAllIntervenants } from "../controllers/tasks/intervenant.controller";

const router = Router()



// router
// .get('/intervenants/:projectID',isUserAuthenticated,checkUserRole(ALL_ROLES),getAllIntervenants)
// .add('/intervenants/:projectID/add',isUserAuthenticated,checkUserRole(ALL_ROLES),addIntervenantToProject)



export default router