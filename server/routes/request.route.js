import { Router } from "express";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js";

import { createRequest, getAllRequests, updateRequest,deleteRequest } from "../controllers/requests/request.controller.js";
import { ALL_ROLES, PROJECT_MANAGER_ROLE, SUPERUSER_ROLE } from "../constants/constants.js";




const router =Router()


router
.get('/get/project/:projectID/requests/',isUserAuthenticated,getAllRequests)
.post('/project/request/create',isUserAuthenticated,createRequest)
.patch('/project/:projectID/request/:requestID/change',isUserAuthenticated,checkUserRole(ALL_ROLES),updateRequest)
.delete('/project/:projectID/request/:requestID/delete',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),deleteRequest)



export default router;