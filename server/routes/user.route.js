import express from 'express'
import { addUser, getAll, getUserInfo } from '../controllers/users/user.controller.js'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'


const router = express.Router()

router
.get('/',isUserAuthenticated,checkUserRole(['superuser']),getAll)
.post('/user_info',isUserAuthenticated,getUserInfo)
.post('/add',isUserAuthenticated,checkUserRole(['superuser']),addUser)

export default router
