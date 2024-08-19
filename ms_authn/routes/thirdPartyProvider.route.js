import express from "express"
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js"
import { SUPERUSER_ROLE } from "../constants/constants.js"
import { changeProvider, deleteProvider, getAllProviders, postProvider } from "../controllers/thirdParty/providers.controller.js"


const router = express.Router()


router
.get('/list',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),getAllProviders)
.post('/provider/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),postProvider)
.delete('/provider/:name/delete/',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),deleteProvider)
.patch('/provider/:name/change/',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),changeProvider)

// .get('/list',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]))



export default router