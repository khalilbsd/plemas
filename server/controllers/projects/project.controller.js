import {
  MalformedObjectId,
  MissingParameter,
  UnknownError
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { PROJECT_PHASE_STATUS_IN_PROGRESS } from "../../constants/constants.js";
import logger from "../../log/config.js";
import Project from "../../models/project/Project.model.js";
import { createProjectPhase } from "./projectPhase.controller.js";

/**
 * Get all the project that exists and in which phase is the project in
 */
export const getAllProjects = catchAsync(async (req, res, next) => {});

/**
 * add a project
 */
export const addProject = catchAsync(async (req, res, next) => {
  const data = req.body;
  if (!data.name || !data.startDate || !data.manager || !data.code)
    return next(
      new MissingParameter("name or start date or manager or code is missing")
    );
  // checking  the code :
  if (data.code.toString().length !== 5 ) return next(new MalformedObjectId("code is valid"));
  const isValidCode = isCodeValid(data.code);
  if (!isValidCode) return next(new MalformedObjectId("Project all ready exists with that code"));

  const projectNameValid = await Project.findOne({where:{name:data.name}})
  if (projectNameValid) return next(new MalformedObjectId("Project all ready exists with that name"));


  const pp = await createProjectPhase(await getLatestProjectId()+1,data.phase)

  console.log(pp);

  // create project instance to use

  let project = { ...data };
  console.log("req.user.id ",req.user.id);
  project.createdBy = req.user.id;
  project.overAllStatus = PROJECT_PHASE_STATUS_IN_PROGRESS;

  delete project.phase;
  delete project.lot;
  // const tempProject = Project.build({...project},{ isNewRecord: true });
  // console.log("temp project",tempProject);
  // const {created,message,projectPhase} = createProjectPhase()
  //building the project object
});

export const updateProject = catchAsync(async (req, res, next) => {});





const getLatestProjectId=async()=>{
  try {
    const id = await Project.max("id")
    if (id) return id
    return  0
  } catch (error) {
    logger.error(error)
    return undefined
  }
}



export const generateProjectCode = catchAsync(async (req, res, next) => {
  const date = new Date();
  const currentYear = date.getFullYear();

  if (currentYear.toString().length !== 4)
    return next(new UnknownError("something went wrong"));
  let code;
  //get the latest project code which is not customized
  const latestProjectCode = await Project.max("code", {
    where: { isCodeCustomized: false }
  });

  if (!latestProjectCode) {
    code = (parseInt(currentYear) % 1000) * 1000;
  } else {
    const projectYear = parseInt(latestProjectCode / 1000) + 2000; //23599
    code =
      projectYear < currentYear
        ? (parseInt(currentYear) % 1000) * 1000
        : latestProjectCode + 1;
  }
  while (!isCodeValid(code)) {
    code++;
  }

  return res.status(200).json({ status: "success", code });
});

const isCodeValid = async (code) => {

  try {
    const project = await Project.findOne({ where: { code } });
    if (project) return false;
    return true;
  } catch (error) {
    logger.error(error);
    return;
  }
};

export const checkProjectCode = catchAsync(async (req, res, next) => {
  const code = req.body.code;
  if (!code) return next(new MissingParameter("code is mandatory parameter"));
  if (!isCodeValid(code))
    return res
      .status(400)
      .json({ status: "failed", message: "code is not valid" });
  return res.status(200).json({ status: "succuss", message: "code is valid" });
});



