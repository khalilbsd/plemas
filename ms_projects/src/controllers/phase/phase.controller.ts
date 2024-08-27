import { messages } from "i18n/messages";
import { IPhase } from "models/Phases/IPhase.interface";
import Phase from "../../models/Phases/Phase.model";
import { createPhase, getPhases } from "../../services/phase/phase.service";
import {
  AppError,
  MalformedObjectId,
  MissingParameter,
  ValidationError
} from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { validationResult } from "express-validator";
/*
 * an api to get all the phases
 */

//   export const getAllPhases = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
//         const phases = await getPhases()
//     return res.status(200).json({ status: "success", phases});
//   });
export const getAllPhases = catchAsync(async (req, res, next) => {
  const phases = await getPhases();
  return res.status(200).json({ status: "success", phases });
});
/*
 * an api to add a phase :
 * accepts an object :
 * {
 *  name: string (UNIQUE)
 * }
 */
export const addPhase = catchAsync(async (req, res, next) => {
  //checking for validation
  const phase: IPhase = req.body;
  const createdPhase = await createPhase(phase);
  if (!createdPhase) return next(new AppError(messages[500]));
  return res.status(200).json({ status: "success", phase: createdPhase });
});
/*
 * an api to a a filters on the phases
 * probably won't need it
 * it accepts a param query
 */
export const filterPhase = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const phases = await Phase.find(filters);
  if (!phases) return next(new AppError(messages["500"]));
  return res.status(200).json({ status: "success", phases });
});
