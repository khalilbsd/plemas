import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter,
  UnknownError
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { PROJECT_PHASE_STATUS_IN_PROGRESS } from "../../constants/constants.js";
import sequelize from "../../db/db.js";
import {
  Lot,
  Phase,
  ProjectLots,
  User,
  UserProfile
} from "../../db/relations.js";
import logger from "../../log/config.js";
import Project from "../../models/project/Project.model.js";
import {
  generateProjectCustomID,
  getProjectByCustomID,
  isCodeValid,
  serializeProject
} from "./lib.js";
import { isLotsValid } from "./lot.controller.js";
import { getPhaseByName } from "./phase.controller.js";
import { createProjectLot } from "./projectLot.controller.js";

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
        model: Phase
      }
    ]
  });
  // console.log(projects[0].phase);
  const projectsList = serializeProject(projects);
  projectsList.sort((a,b)=>b.code - a.code )
  res.status(200).json({ status: "success", projects: projectsList });
});

/**
 * add a project
 */
export const addProject = catchAsync(async (req, res, next) => {
  const data = req.body;
  console.log(data);
  if (!data.name || !data.startDate || !data.manager || !data.code)
    return next(
      new MissingParameter("name or start date or manager or code is missing")
    );
  // checking the code:

  if (data.code.toString().length !== 5)
    return next(new MalformedObjectId("code is not valid"));

  if (data.prevPhase) {
    const isValidCode = await isCodeValid(data.code,data.phase);
    if (!isValidCode)
      return next(
        new MalformedObjectId(
          "Project already exists with that code: did you mean to create a phase?"
        )
      );
  }

  // const projectNameValid = await Project.findOne({
  //   where: { name: data.name }
  // });
  // console.log("SEARCHED PROJECT WITH SIM NAME ", projectNameValid);
  // if (projectNameValid)
  //   return next(new MalformedObjectId("Project already exists with that name"));

  if (!data.phase || !data.lot.length)
    return next(new MalformedObjectId("lots and phase are mandatory"));

  // create pure project instance to use
  let project = { ...data };

  project.createdBy = req.user.id;
  project.overAllStatus = PROJECT_PHASE_STATUS_IN_PROGRESS;

  delete project.phase;
  delete project.lot;
  delete project.linked;

  // check for phase:
  const phase = await getPhaseByName(data.phase);
  console.log("phase to be added", phase);
  if (!phase) return next(new ElementNotFound("we couldn't find phase"));

  project.phaseID = phase.id;

  // generating a custom id for the project to use
  const customID = generateProjectCustomID(
    project.code,
    project.name,
    phase.abbreviation
  );
  try {
    const newProject = await Project.create(
      { ...project, customId: customID },

    );

    console.log("new project");
    // const projectLot = await createProjectLot(newProject.id, data.lot);
    const isAllLotsValid = await isLotsValid(data.lot);
    if (!isAllLotsValid) {
      return next(new ElementNotFound("we couldn't find all the lots"));
    }
    console.log("LOt VALID", isAllLotsValid);
    for (const lotID in isAllLotsValid) {
      console.log("LOG ID ", lotID);
      const isProjectLotExists = await ProjectLots.findOne({
        where: {
          projectID: newProject.id,
          lotID: lotID
        }
      });
      if (!isProjectLotExists) {
        await ProjectLots.create(
          {
            projectID: newProject.id,
            lotID: isAllLotsValid[lotID]
          },

        );
      }
    }
    return res.status(200).json({
      status: "success",
      message: "project created successfully",
      projectPhase: newProject
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    // await transaction.rollback();
    return next(new UnknownError("Internal server error "));
  }
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
  const { type } = req.query;
  const date = new Date();
  const currentYear = date.getFullYear();

  if (currentYear.toString().length !== 4)
    return next(new UnknownError("something went wrong"));
  var code = undefined;
  if (type !== "old") {
    const latestProjectCode = await Project.max("code");
    if (!latestProjectCode) {
      code = (parseInt(currentYear) % 1000) * 1000;
    } else {
      code = latestProjectCode + 1;
    }
  }
  //get the latest project code which is not customized

  //projects List





    const  projectList = await Project.findAll({
      attributes: ["id","code", "name", "customId"],

    });

  // convert projects List :
  projectList.forEach(project=>{
    project.code = project.code.toString()

  })


  console.log(projectList);
  return res.status(200).json({
    status: "success",
    validCode: code,
    existantProjects: projectList
  });
});

export const checkProjectCode = catchAsync(async (req, res, next) => {
  const code = req.body.code;

  if (!code) return next(new MissingParameter("code is mandatory parameter"));

  if (`${code}`.length !== 5)
    return res.status(400).json({
      status: "failed",
      message: "code is not valid",
      isValid: false,
      code
    });

  return res
    .status(200)
    .json({ status: "succuss", message: "code is valid", isValid: true, code });
});

// export const changeProjectPhase = catchAsync(async (req, res, next) => {
//   const customID = req.params.custom_name;

//   if (!customID || !req.body.phase)
//     return next(
//       new MissingParameter("project custom ID and phase name is mandatory")
//     );
//   const project = await Project.findOne({
//     where: { customID: customID },
//   });
//   // console.log(project.projectPhases);
//   if (!project)
//     return next(new ElementNotFound("there is no project with this custom id"));

//   const phaseAbb = await Phase.findOne({ where: { name: req.body.phase } });

//   if (!phaseAbb)
//     return next(new ElementNotFound("there is no phase with this name"));

//   const projectPhase = await getProjectPhaseFromOldPhases(
//     project.projectPhases,
//     phaseAbb
//   );
//   if (projectPhase < 0) {
//     // await ProjectPhase.create({
//     //   activePhase: true,
//     //   phaseID: phaseAbb.id,
//     //   projectID: project.id
//     // });
//     //deactivate other phases
//     project.projectPhases.forEach((element) => {
//       element.activePhase = false;
//       element.save();
//     });

//     //updating customID
//     project.customId = generateProjectCustomID(
//       project.code,
//       project.name,
//       phaseAbb.abbreviation
//     );
//     project.save();

//     return res.status(200).json({
//       success: "success",
//       message: `project is now in phase ${phaseAbb.name}`,
//       created: true,
//       updated: false
//     });
//   }
//   logger.info("checking if the provided phase is the same as the current one");
//   if (project.projectPhases[projectPhase].activePhase == true) {
//     logger.info("nothing to do the provided phase is already active");
//     return next(new NothingChanged("Phase is already active"));
//   }

//   logger.info(
//     "setting the new phase that already exist  to  active and disabling the other ones"
//   );
//   //update project to old phases
//   project.projectPhases[projectPhase].activePhase = true;
//   project.projectPhases[projectPhase].save();
//   //deactivate other phases
//   project.projectPhases.forEach(async (element) => {
//     if (element.phaseID !== phaseAbb.id) {
//       element.activePhase = false;
//       element.save();
//     }
//   });
//   //updating customID
//   project.customId = generateProjectCustomID(
//     project.code,
//     project.name,
//     phaseAbb.abbreviation
//   );
//   project.save();
//   return res.status(200).json({
//     success: "success",
//     message: `project is now in phase ${phaseAbb.name}`,
//     created: false,
//     updated: true
//   });
// });

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
        // model: ProjectPhase,
        where: { phaseID: phaseDetails.id }
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

export const checkProjectLinking = catchAsync(async (req, res, next) => {
  const nbProjects = await Project.count();
  console.log(nbProjects);
  if (nbProjects > 0)
    return res.status(200).json({ state: "success", isLinkingPossible: true });
  return res.status(200).json({ state: "success", isLinkingPossible: false });
});
