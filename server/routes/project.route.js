import express from 'express'
import { isUserAuthenticated } from '../middleware/auth.js'
import { addProject, generateProjectCode, getAllProjects, updateProject } from '../controllers/projects/project.controller.js'


const router = express.Router()


router
.get('/all',isUserAuthenticated,getAllProjects)
.get('/generate/code',isUserAuthenticated,generateProjectCode)
.post('/add',isUserAuthenticated,addProject)
.patch('/change',isUserAuthenticated,updateProject)

export default router
