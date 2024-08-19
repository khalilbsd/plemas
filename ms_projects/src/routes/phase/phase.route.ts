import { ALL_ROLES, SUPERUSER_ROLE } from 'constants/constants'
import { addPhase, filterPhase, getAllPhases } from 'controllers/phase/phase.controller'
import express from 'express'
import { checkUserRole, isUserAuthenticated } from 'middleware/auth'
import { validationName,
    validationAbbreviation, } from './validators'
// import { checkUserRole, isUserAuthenticated } from '../middleware/auth'
// import { ALL_ROLES, SUPERUSER_ROLE } from '../constants/constants'
// import { addPhase, filterPhase, getAllPhases } from '../controllers/phase/phase.controller'



const router= express.Router()

const phaseCreationValidationChain=()=>
    validationName() && validationAbbreviation()



router
.get('/all',isUserAuthenticated,checkUserRole(ALL_ROLES),getAllPhases)
.get('/filter',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),filterPhase)
.post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]), validationName(),validationAbbreviation(),addPhase)
// .post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]), phaseCreationValidationChain(),addPhase)


export default router