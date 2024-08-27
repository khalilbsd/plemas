import { messages } from "i18n/messages";
import { IProject } from "models/projects/IProjects.interface";
import { isPhaseExistsByID } from "services/phase/phase.service";
import { createProject, isCodeValid } from "services/project/project.service";
import { AppError, ElementNotFound, MalformedObjectId } from "utils/appError";
import { catchAsync } from "utils/catchAsync";

const getAllProjects = catchAsync(async (req, res, next) => {});
const checkProjectLinking = catchAsync(async (req, res, next) => {});
const getProjectsInPhase = catchAsync(async (req, res, next) => {});
const generateProjectCode = catchAsync(async (req, res, next) => {});
const checkProjectCode = catchAsync(async (req, res, next) => {});

const addProject = catchAsync(async (req, res, next) => {
  const data: IProject = req.body;
  console.log("recieving data", data);
  const isCodeExist = await isCodeValid(data.code);

  if (isCodeExist)
    return next(new MalformedObjectId(messages.existing_project_code));

  if (!(await isPhaseExistsByID(data.phases[0])))
    return next(new ElementNotFound(messages.phase_not_found));

  const createdProject = await createProject(req, data);
  if (!createdProject) return next(new AppError(messages[500]));

  return res.status(200).json({
    status: "success",
    message: messages["project_created_successfully"],
    newProject: createdProject,
  });
});
const updateProjectDetails = catchAsync(async (req, res, next) => {});
const getProjectById = catchAsync(async (req, res, next) => {});
const getProjectTracking = catchAsync(async (req, res, next) => {});
const getAllIntervenants = catchAsync(async (req, res, next) => {});
const addIntervenantToProject = catchAsync(async (req, res, next) => {});

const removeIntervenantFromProject = catchAsync(async (req, res, next) => {});
const assignManagerHoursBulk = catchAsync(async (req, res, next) => {});
const abandonOrResumeProject = catchAsync(async (req, res, next) => {});

export {
  getAllProjects,
  checkProjectLinking,
  getProjectsInPhase,
  generateProjectCode,
  checkProjectCode,
  addProject,
  updateProjectDetails,
  getProjectById,
  getProjectTracking,
  getAllIntervenants,
  removeIntervenantFromProject,
  assignManagerHoursBulk,
  abandonOrResumeProject,
  addIntervenantToProject,
};
