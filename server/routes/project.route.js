import express from 'express'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'
import { addProject, generateProjectCode, getAllProjects, updateProjectDetails,changeProjectPhase, getProjectsInPhase } from '../controllers/projects/project.controller.js'
import { SUPERUSER_ROLE } from '../constants/constants.js'


const router = express.Router()


router
.get('/all',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),getAllProjects)
.get('/phase/activated',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),getProjectsInPhase)
.get('/generate/code',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),generateProjectCode)
.post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),addProject)
.patch('/change/:customID',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),updateProjectDetails)
.patch('/change/project/:custom_name/phase',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),changeProjectPhase)
export default router
