import express from 'express'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'
import { SUPERUSER_ROLE } from '../constants/constants.js'
import { addPhase, filterPhase, getAllPhases } from '../controllers/projects/phase.controller.js'



const router= express.Router()


router
.get('/all',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),getAllPhases)
.get('/filter',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),filterPhase)
.post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),addPhase)


export default router