import { ALL_ROLES, SUPERUSER_ROLE } from "constants/constants";
import {
  addPhase,
  filterPhase,
  getAllPhases
} from "controllers/phase/phase.controller";
import express from "express";
import { checkUserRole, isUserAuthenticated } from "middleware/auth";
import {
  validationName,
  validationAbbreviation,
  validationDescription
} from "./validators";
import { validateFields } from "middleware/validator";
import { messages } from "i18n/messages";
// import { checkUserRole, isUserAuthenticated } from '../middleware/auth'
// import { ALL_ROLES, SUPERUSER_ROLE } from '../constants/constants'
// import { addPhase, filterPhase, getAllPhases } from '../controllers/phase/phase.controller'

const router = express.Router();

router
  .get("/all", isUserAuthenticated, checkUserRole(ALL_ROLES), getAllPhases)
  .get(
    "/filter",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    filterPhase
  )
  .post(
    "/add",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    validateFields([
      validationName(),
      validationAbbreviation(),
      validationDescription()
    ],messages.phase_malformed),
    addPhase
  );
// .post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]), phaseCreationValidationChain(),addPhase)

export default router;
