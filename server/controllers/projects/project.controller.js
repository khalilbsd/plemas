import moment from "moment";
import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter,
  UnAuthorized,
  UnknownError
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import {
  PROJECT_MANAGER_ROLE,
  PROJECT_PHASE_STATUS_IN_PROGRESS,
  SUPERUSER_ROLE
} from "../../constants/constants.js";
import {
  Lot,
  Phase,
  ProjectLots,
  Request,
  Task,
  User,
  UserProfile
} from "../../db/relations.js";
import logger from "../../log/config.js";
import Project from "../../models/project/Project.model.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";
import {
  calculateDates,
  generateProjectCustomID,
  isCodeValid,
  serializeProject
} from "./lib.js";
import { isLotsValid } from "./lot.controller.js";
import { getPhaseByName } from "./phase.controller.js";

/**
 * Get all the project that exists and in which phase is the project in
 *
 */
export const getAllProjects = catchAsync(async (req, res, next) => {
  let projects = [];
  const objectQuery = {};
  if (req.user.role === PROJECT_MANAGER_ROLE) {
    // objectQuery.manager = req.user.id;
    objectQuery[Op.or] = [{ manager: req.user.id }];
  }
  if (
    req.user.role === PROJECT_MANAGER_ROLE ||
    (req.user.role !== SUPERUSER_ROLE && !req.user.isSuperUser)
  ) {
    let interventions = await Intervenant.findAll({
      where: { intervenantID: req.user.id },
      attributes: ["projectID"]
    });
    let projectIds = [];
    interventions.forEach((project) => {
      projectIds.push({ id: project.projectID });
    });

    if (objectQuery[Op.or]) {
      projectIds.forEach((ids) => {
        objectQuery[Op.or].push(ids);
      });
      // objectQuery[Op.or].push(projectIds)
    } else {
      objectQuery[Op.or] = projectIds;
    }
  }

  projects = await Project.findAll({
    where: objectQuery,
    include: [
      {
        model: ProjectLots,
        include: [Lot]
      },
      {
        model: User,
        as: "managerDetails",
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["image", "name", "lastName"]
          }
        ]
      },
      {
        model: Phase
      },
      {
        model: Request
      }
    ]
  });

  // console.log(projects[0].phase);
  const projectsList = serializeProject(projects);
  projectsList.sort((a, b) => b.code - a.code);

  const dates = calculateDates(2);

  let tasks = [];
  const today = new Date();

  for (const projIdx in projectsList) {
    let projectTasks = await Task.findAll({
      attributes: ["id", "name", "name", "startDate", "dueDate", "state"],
      order: [["dueDate", "DESC"]],
      where: {
        "dueDate": {
          [Op.gte]: today
        }
      },
      include: [
        {
          model: Intervenant,
          attributes: ["id"],
          where: {
            projectID: projectsList[projIdx].id
          }
        }
      ]
    });
    projectTasks.sort(
      (a, b) =>
        moment(b.dueDate, "DD/MM/YYYY") - moment(a.dueDate, "DD/MM/YYYY")
    );
    if (projectTasks) {
      tasks.push({
        projectID: projectsList[projIdx].id,
        tasks: projectTasks
      });
    }
  }

  tasks.sort((a, b) => b.tasks.length - a.tasks.length);

  const indexMap = {};
  tasks.forEach((task, index) => {
    indexMap[task.projectID] = index;
  });

  // Custom sorting function based on the tasks array index
  const customSort = (a, b) => {
    const indexA = indexMap[a.id];
    const indexB = indexMap[b.id];
    // Compare the indices
    return indexA - indexB;
  };

  // Sort the projectsList using the custom sorting function
  projectsList.sort(customSort);

  res.status(200).json({
    status: "success",
    projects: projectsList,
    dates: dates,
    projectsTasks: tasks
  });
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
  // checking the code:

  if (data.code.toString().length !== 5)
    return next(new MalformedObjectId("code is not valid"));

  const isValidCode = await isCodeValid(data.code, data.phase);

  if (!isValidCode)
    return next(
      new MalformedObjectId(
        "Project already exists with that code: did you mean to create a phase?"
      )
    );

  // const projectNameValid = await Project.findOne({
  //   where: { name: data.name }
  // });
  // console.log("SEARCHED PROJECT WITH SIM NAME ", projectNameValid);
  // if (projectNameValid)
  //   return next(new MalformedObjectId("Project already exists with that name"));

  if (!data.phase || !data.lot.length)
    return next(new MalformedObjectId("lots and phase are mandatory"));

  // create pure project instance to use
  if (data.startDate) data.startDate = moment(data.startDate, "DD/MM/YYYY");

  let project = { ...data };

  project.createdBy = req.user.id;
  project.overAllStatus = PROJECT_PHASE_STATUS_IN_PROGRESS;

  delete project.phase;
  delete project.lot;
  delete project.linked;

  // check for phase:
  const phase = await getPhaseByName(data.phase);

  if (!phase) return next(new ElementNotFound("we couldn't find phase"));

  project.phaseID = phase.id;

  // generating a custom id for the project to use
  const customID = generateProjectCustomID(
    project.code,
    project.name,
    phase.abbreviation
  );
  try {
    const newProject = await Project.create({ ...project, customId: customID });

    // const projectLot = await createProjectLot(newProject.id, data.lot);
    const isAllLotsValid = await isLotsValid(data.lot);
    if (!isAllLotsValid) {
      return next(new ElementNotFound("we couldn't find all the lots"));
    }

    for (const lotID in isAllLotsValid) {
      const isProjectLotExists = await ProjectLots.findOne({
        where: {
          projectID: newProject.id,
          lotID: lotID
        }
      });
      if (!isProjectLotExists) {
        await ProjectLots.create({
          projectID: newProject.id,
          lotID: isAllLotsValid[lotID]
        });
      }
    }
    return res.status(200).json({
      status: "success",
      message: "project created successfully",
      projectPhase: newProject
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    // await transaction.rollback();
    return next(new UnknownError("Internal server error "));
  }
});

export const updateProjectDetails = catchAsync(async (req, res, next) => {
  const details = req.body;
  if (!details || !Object.keys(details).length)
    return next(new MissingParameter("Des paramètres manquants"));
  let phase;
  if (details.phase || details.code) {
    const objectQuery = {
      // id:req.params.projectID
    };
    if (details.phase) {
      phase = await Phase.findOne({ where: { name: details.phase } });
      objectQuery.phaseID = phase.id;
    }
    if (details.code) {
      objectQuery.code = details.code;
    }
    const projectWithPhase = await Project.findOne({ where: objectQuery });

    if (projectWithPhase)
      return next(
        new AppError("un projet avec ce code et cette phase existe déjà", 403)
      );
  }

  const project = await Project.findByPk(req.params.projectID, {
    include: [Phase]
  });

  if (!project) return next(new ElementNotFound("Projet introuvable"));
  logger.info("attempting to update the project info");
  if (details.code && details.code.toString()?.length !== 5)
    return next(
      new AppError("le code du projet doit contenir 5 caractères", 401)
    );

  if (details.phase) {
    details.phaseID = phase.id;
  }

  details.customId = generateProjectCustomID(
    details.code || project.code,
    details.name || project.name,
    phase?.abbreviation || project.phase.abbreviation
  );

  if (details.startDate)
    details.startDate = moment(details.startDate, "DD/MM/YYYY");

  await project.update({ ...details });

  const queryObjectPL = {};
  queryObjectPL.projectID = req.params.projectID;

  // creation of new projects lots
  for (const lotIdx in details.lots) {
    const lt = await Lot.findOne({ where: { name: details.lots[lotIdx] } });
    queryObjectPL.lotID = lt.id;

    const [lot, created] = await ProjectLots.findOrCreate({
      // where:  { lotID: lt.id, projectID: req.params.projectID }})
      where: queryObjectPL
    });
  }

  // destruction of existing  projects lots
  // if (!phase) {
  const projectLots = await ProjectLots.findAll({
    where: { projectID: req.params.projectID },
    attributes: ["lotID", "projectID"],
    include: [
      {
        model: Lot,
        attributes: ["name"]
      }
    ]
  });
  projectLots.forEach(async (pl) => {
    if (!details.lots.includes(pl.lot.name)) {
      await pl.destroy();
    }
  });
  // }

  return res.status(200).json({
    status: "success",
    message: "Les détails des projets ont été mis à jour"
  });
});

export const generateProjectCode = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const date = new Date();
  const currentYear = date.getFullYear();

  if (currentYear.toString().length !== 4)
    return next(new UnknownError("quelque chose n'a pas fonctionné"));
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

  const projectList = await Project.findAll({
    attributes: ["id", "code", "name", "customId"]
  });

  // convert projects List :
  projectList.forEach((project) => {
    project.code = project.code.toString();
  });

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

  if (nbProjects > 0)
    return res.status(200).json({ state: "success", isLinkingPossible: true });
  return res.status(200).json({ state: "success", isLinkingPossible: false });
});

export const getProjectById = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;

  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID, {
    include: [
      {
        model: ProjectLots,
        attributes: ["lotID"],
        include: [{ model: Lot, attributes: ["name"] }]
      },
      {
        model: Project,
        attributes: ["name"],
        include: [
          {
            model: Phase,
            attributes: ["name"]
          }
        ]
      },
      {
        model: User,
        as: "managerDetails",
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["name", "lastName", "image"]
          }
        ]
      },
      {
        model: User,
        as: "creatorDetails",
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["name", "lastName", "image"]
          }
        ]
      },
      {
        model: Phase,
        attributes: ["name", "abbreviation"]
      }
    ]
  });

  if (!project) return next(new ElementNotFound(`Project was not found`));

  const projectHours = await Intervenant.sum("nbHours", {
    where: { projectID: project.id }
  });
  const result = project.toJSON();
  result.projectNbHours = projectHours;

  res.status(200).json({ status: "success", project: result });
});

export const assignManagerHours = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);

  if (!project) return next(new ElementNotFound("Projet introuvable"));
  let userId;

  if (req.user.role === PROJECT_MANAGER_ROLE) {
    if (req.user.id !== project.manager)
      return next(new UnAuthorized("Vous n’êtes pas le chef du ce projet"));
    userId = req.user.id;
  }

  if (req.user.isSuperUser && req.user.role === SUPERUSER_ROLE) {
    userId = req.body.user;
  }
  const user = await User.findByPk(userId);
  if (!user) return next(new ElementNotFound("le chef projet est introuvable"));

  const hours = parseInt(req.body.hours);
  if (isNaN(hours) || hours < 0)
    return next(
      new AppError("le nombre des heurs doit être un chiffre positif ", 400)
    );
  if (hours < project.managerHours)
    return next(
      new AppError("vous ne pouvez pas diminuer votre nombre d'heures", 400)
    );

  project.managerHours = hours;

  await project.save();

  return res
    .status(200)
    .json({ status: "success", message: "heurs renseigner avec succès" });
});
