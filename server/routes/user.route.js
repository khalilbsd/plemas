import express from 'express'
import { addUser, getAll } from '../controllers/users/user.controller.js'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'


const router = express.Router()

router
.get('/',isUserAuthenticated,checkUserRole(['client']),getAll)
.post('/add',isUserAuthenticated,checkUserRole([]),addUser)

export default router
