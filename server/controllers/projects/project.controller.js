import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter,
  NothingChanged,
  UnknownError
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { PROJECT_PHASE_STATUS_IN_PROGRESS } from "../../constants/constants.js";
import {
  Lot,
  Phase,
  ProjectLots,
  ProjectPhase,
  User,
  UserProfile
} from "../../db/relations.js";
import { ForbiddenError } from "../../errors/http.js";
import logger from "../../log/config.js";
import Project from "../../models/project/Project.model.js";
import {
  generateProjectCustomID,
  getProjectByCustomID,
  getProjectPhaseFromOldPhases,
  isCodeValid,
  serializeProject
} from "./lib.js";
import { createProjectPhase } from "./projectPhase.controller.js";

/**
 * Get all the project that exists and in which phase is the project in
 *
 */
export const getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.findAll({
    include: [
      {
        model: ProjectLots,
        include: [Lot]
      },
      {
        model: User,
        as: "managerID",
        include: [UserProfile]
      },
      {
        model: ProjectPhase,
        where: { activePhase: true },
        include: [Phase]
      }
    ]
  });
  // console.log(projects[1].projectLots.length);
  const projectsList = serializeProject(projects);

  res.status(200).json({ status: "success", projects: projectsList });
});

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
  console.log(data);
  if (data.code.toString().length !== 5)
    return next(new MalformedObjectId("code is not valid"));
  const isValidCode = await isCodeValid(data.code);
  if (!isValidCode)
    return next(
      new MalformedObjectId("Project all ready exists with that code")
    );

  const projectNameValid = await Project.findOne({
    where: { name: data.name }
  });
  if (projectNameValid)
    return next(
      new MalformedObjectId("Project all ready exists with that name")
    );

  // create project instance to use

  let project = { ...data };

  project.createdBy = req.user.id;
  project.overAllStatus = PROJECT_PHASE_STATUS_IN_PROGRESS;

  delete project.phase;
  delete project.lot;

  const pp = await createProjectPhase(project, data.phase, data.lot);
  if (!pp.created) {
    logger.error(pp.message);
    return next(
      new AppError("we couldn't create your project! try again later", 400)
    );
  }
  return res.status(200).json({
    status: "success",
    message: pp.message,
    projectPhase: pp.newPhase
  });
  // const {created,message,projectPhase} = createProjectPhase()
});

export const updateProjectDetails = catchAsync(async (req, res, next) => {
  const details = req.body;

  if (!details || !Object.keys(details).length)
    return next(new MissingParameter("missing parameters"));
  if (details.code || details.customId)
    return next(
      new AppError(
        "you can not change the value of the custom id or the project code",
        403
      )
    );

  const project = await getProjectByCustomID(req.params.customID);
  if (!project) return next(new ElementNotFound("Project not found"));
  logger.info("attempting to update the project info");
  await project.update({ ...details });
  return res
    .status(200)
    .json({ status: "success", message: "Project details updated" });
});

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
  const findValidCode = async (currentCode) => {
    while (true) {
      if (await isCodeValid(currentCode)) {
        return currentCode;
      }
      currentCode++;
    }
  };

  const validCode = await findValidCode(code);
  return res.status(200).json({ status: "success", validCode });
});

export const checkProjectCode = catchAsync(async (req, res, next) => {
  const code = req.body.code;

  console.log("CODE", code);
  if (!code) return next(new MissingParameter("code is mandatory parameter"));

  const findValidCode = async (currentCode) => {
    if (currentCode.length !== 5) return false;
    if (await isCodeValid(currentCode)) {
      return true;
    }
    return false;
  };

  const validCode = await findValidCode(code);
  console.log("CODE :", code, " VALIDATION :", validCode);

  if (!validCode)
    return res
      .status(400)
      .json({
        status: "failed",
        message: "code is not valid",
        isValid: false,
        code
      });
  return res
    .status(200)
    .json({ status: "succuss", message: "code is valid", isValid: true, code });
});

export const changeProjectPhase = catchAsync(async (req, res, next) => {
  const customID = req.params.custom_name;

  if (!customID || !req.body.phase)
    return next(
      new MissingParameter("project custom ID and phase name is mandatory")
    );
  const project = await Project.findOne({
    where: { customID: customID },
    include: [ProjectPhase]
  });
  // console.log(project.projectPhases);
  if (!project)
    return next(new ElementNotFound("there is no project with this custom id"));

  const phaseAbb = await Phase.findOne({ where: { name: req.body.phase } });

  if (!phaseAbb)
    return next(new ElementNotFound("there is no phase with this name"));

  const projectPhase = await getProjectPhaseFromOldPhases(
    project.projectPhases,
    phaseAbb
  );
  if (projectPhase < 0) {
    await ProjectPhase.create({
      activePhase: true,
      phaseID: phaseAbb.id,
      projectID: project.id
    });
    //deactivate other phases
    project.projectPhases.forEach((element) => {
      element.activePhase = false;
      element.save();
    });

    //updating customID
    project.customId = generateProjectCustomID(
      project.code,
      project.name,
      phaseAbb.abbreviation
    );
    project.save();

    return res.status(200).json({
      success: "success",
      message: `project is now in phase ${phaseAbb.name}`,
      created: true,
      updated: false
    });
  }
  logger.info("checking if the provided phase is the same as the current one");
  if (project.projectPhases[projectPhase].activePhase == true) {
    logger.info("nothing to do the provided phase is already active");
    return next(new NothingChanged("Phase is already active"));
  }

  logger.info(
    "setting the new phase that already exist  to  active and disabling the other ones"
  );
  //update project to old phases
  project.projectPhases[projectPhase].activePhase = true;
  project.projectPhases[projectPhase].save();
  //deactivate other phases
  project.projectPhases.forEach(async (element) => {
    if (element.phaseID !== phaseAbb.id) {
      element.activePhase = false;
      element.save();
    }
  });
  //updating customID
  project.customId = generateProjectCustomID(
    project.code,
    project.name,
    phaseAbb.abbreviation
  );
  project.save();
  return res.status(200).json({
    success: "success",
    message: `project is now in phase ${phaseAbb.name}`,
    created: false,
    updated: true
  });
});

export const getProjectsInPhase = catchAsync(async (req, res, next) => {
  const { phase } = req.query;
  if (!phase) return res.status(200).json({ status: "success", projects: [] });
  //verify if phase is exists
  const phaseDetails = await Phase.findOne({ where: { name: phase } });
  if (!phaseDetails)
    return next(new ElementNotFound("phase does't not exists"));
  //get all the projects that are active in that phase
  const projects = await Project.findAll({
    include: [
      {
        model: ProjectPhase,
        where: { phaseID: phaseDetails.id, activePhase: true }
      }
    ]
  });
  if (!projects.length)
    return res.status(200).json({
      status: "info",
      message: `there is no active projects in the phase ${phase}`,
      projects: []
    });

  return res.status(200).json({
    status: "info",
    message: `the list of projects in the ${phase} has been updated`,
    projects
  });
});
