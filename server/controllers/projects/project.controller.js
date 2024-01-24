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
  ACTION_NAME_ADD_PROJECT_MANAGER,
  ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS,
  ACTION_NAME_PROJECT_CREATION,
  ACTION_NAME_PROJECT_UPDATE,
  ACTION_NAME_PROJECT_UPDATE_MANAGER,
  CLIENT_ROLE,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  PROJECT_PHASE_STATUS_IN_PROGRESS,
  SUPERUSER_ROLE,
  TASK_STATE_ABANDONED,
  TASK_STATE_BLOCKED,
  TASK_STATE_DOING,
  TASK_STATE_DONE
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
import sequelize from "../../db/db.js";
import { getTracking, takeNote } from "../../Utils/writer.js";
import { findObjectDifferences } from "../../Utils/utils.js";
import { getProjectsTasksBulk } from "../tasks/task.controller.js";
import { isAllProjectsAreValid } from "../tasks/lib.js";
import InterventionHour from "../../models/tasks/interventionHours.model.js";

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
    req.user.role === INTERVENANT_ROLE
    // (req.user.role !== SUPERUSER_ROLE && !req.user.isSuperUser)
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

  const projectsList = serializeProject(projects);
  // projectsList.sort((a, b) => b.code - a.code);

  const dates = calculateDates(3);


  let tasks = await getProjectsTasksBulk(
    projectsList.map((project) => project.id)
  );


  const indexMap = {};
  tasks.forEach((task, index) => {
    indexMap[task.projectID] = index;
  });

  // Custom sorting function based on the tasks array index
  const customSort = (a, b) => {
    const indexA = indexMap[a.id];
    const indexB = indexMap[b.id];

    // Check if project A has tasks
    const hasTasksA = tasks[indexA].tasks.length > 0;

    // Check if project B has tasks
    const hasTasksB = tasks[indexB].tasks.length > 0;

    // Compare based on whether they have tasks or not
    if (hasTasksA && hasTasksB) {
      // Both have tasks, compare based on the dueDate of the first task
      return tasks[indexA].tasks[0].dueDate - tasks[indexB].tasks[0].dueDate;
    } else if (hasTasksA) {
      // Only project A has tasks, it should come first
      return -1;
    } else if (hasTasksB) {
      // Only project B has tasks, it should come first
      return 1;
    } else {
      // Both have no tasks, keep their original order
      return indexA - indexB;
    }
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

  if (!data.phase || !data.lot.length)
    return next(new MalformedObjectId("lots and phase are mandatory"));

  const regexPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (data.startDate) {
    if (!regexPattern.test(data.startDate)) {
      if (data.startDate) data.startDate = moment(data.startDate, "DD/MM/YYYY");
    }
  }

  // create pure project instance to use

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

    await newProject.reload({
      include: [
        {
          model: User,
          as: "managerDetails",
          attributes: ["email"]
        }
      ]
    });
    //saving tracking
    await takeNote(
      ACTION_NAME_PROJECT_CREATION,
      req.user.email,
      newProject.id,
      {}
    );
    await takeNote(
      ACTION_NAME_ADD_PROJECT_MANAGER,
      req.user.email,
      newProject.id,
      {
        extraProps: {
          managerEmail: newProject.managerDetails.email
        }
      }
    );

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
    include: [
      Phase,
      {
        model: User,
        as: "managerDetails",
        attributes: ["email"]
      }
    ]
  });

  if (!project) return next(new ElementNotFound("Projet introuvable"));
  logger.info("attempting to update the project info");
  let oldManager = "";
  if (details.manager) {
    oldManager = project.managerDetails.email;
  }

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

  if (
    details.state !== project.state &&
    details.state === TASK_STATE_DOING &&
    project.dueDate
  ) {

    details.dueDate = null;
    project.dueDate = null;
  }

  //flag the project as done
  // if the project is not already done
  if (details.dueDate && !project.dueDate && !details.clearDueDate) {
    details.state = TASK_STATE_DONE;
    let taskIds = await Intervenant.findAll({
      where: { projectID: req.params.projectID },
      attributes: ["taskID"]
    });
    let ids = [];
    taskIds.forEach(({ taskID }) =>
      !ids.includes(taskID) ? ids.push(taskID) : null
    );
    await Task.update({ state: TASK_STATE_DONE }, { where: { id: ids } });
    details.dueDate = moment(details.dueDate, "DD/MM/YYYY");
  } else {
    if (details.dueDate && details.clearDueDate) {
      details.state = TASK_STATE_DOING;
      details.dueDate = null;
    }
  }

  if ([TASK_STATE_ABANDONED, TASK_STATE_DONE].includes(details.state)) {
    details.dueDate = moment(new Date(), "DD/MM/YYYY");
    if (TASK_STATE_ABANDONED === details.state) {
      abandonProject(TASK_STATE_ABANDONED, project.id);
    }
    if (TASK_STATE_DONE === details.state) {
      abandonProject(TASK_STATE_DONE, project.id);
    }
  }

  await project.update({ ...details });

  if (Object.keys(details).includes("lots")) {
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
      if (!details.lots?.includes(pl.lot.name)) {
        await pl.destroy();
      }
    });
    // }
  }

  await project.reload({
    include: [
      {
        model: User,
        as: "managerDetails",
        attributes: ["email"]
      }
    ]
  });

  const differences = findObjectDifferences(
    { ...project.oldValues },
    project.toJSON()
  );
  let oldValuesString = "";
  let newValuesString = "";

  Object.keys(differences).forEach((key) => {
    oldValuesString = oldValuesString.concat(differences[key].oldValue, ", ");
    newValuesString = newValuesString.concat(differences[key].newValue, ", ");
  });

  await takeNote(ACTION_NAME_PROJECT_UPDATE, req.user.email, project.id, {
    extraProps: {
      oldValues: oldValuesString,
      newValues: newValuesString
    }
  });
  if (details.manager && details.manager !== project.oldValues.manager) {
    await takeNote(
      ACTION_NAME_PROJECT_UPDATE_MANAGER,
      req.user.email,
      project.id,
      {
        extraProps: {
          newManager: project.managerDetails.email,
          oldManager: oldManager
        }
      }
    );
  }
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
      },
      {
        model: Intervenant
      }
    ]
  });

  if (!project) return next(new ElementNotFound(`Project was not found`));
  // chekc if the user has access to the project
  if (
    !req.user.isSuperUser &&
    req.user.role !== CLIENT_ROLE &&
    project.manager !== req.user.id
  ) {
    const projectIntervenants = project.intervenants.map(
      (entry) => entry.intervenantID
    );
    if (!projectIntervenants.includes(req.user.id))
      return next(new UnAuthorized("vous ne faites pas partie de ce projet"));
  }

  const projectHours = await Intervenant.sum("nbHours", {
    where: { projectID: project.id }
  });

  const result = project.toJSON();

  let taskIds = await Intervenant.findAll({
    where: {
      projectID: project.id
    },
    attributes: ["taskID"]
  });
  let ids = [];

  taskIds.forEach(({ taskID }) => {
    if (!ids.includes(taskID)) ids.push(taskID);
  });

  result.projectNbHours = projectHours;
  result.isProjectRunning = [TASK_STATE_DOING, TASK_STATE_BLOCKED].includes(
    project.state
  );

  const taskStates = await Task.findAll({
    where: {
      id: ids,
      state: [
        TASK_STATE_BLOCKED,
        TASK_STATE_DOING,
        TASK_STATE_DONE,
        TASK_STATE_ABANDONED
      ]
      //check if
    },
    attributes: ["state", [sequelize.fn("COUNT", sequelize.col("*")), "nb"]],
    group: "state"
  });

  const taskStatus = taskStates.map((item) => item.toJSON());
  // if (taskStatus.length) {
  //   let blockedNbr = taskStatus.filter(
  //     ({ state }) => state === TASK_STATE_BLOCKED
  //   )[0]?.nb;
  //   if (blockedNbr) {
  //     result.state = TASK_STATE_BLOCKED;
  //   }

  // } else {
  //   result.state = TASK_STATE_DOING;
  // }

  return res
    .status(200)
    .json({ status: "success", project: result, taskStatus });
});

/**
 * {
 * data:date,
 * projectsHours:{
 *  id :{value:hours,changed:bool}
 *  id :{value:hours,changed:bool}
 *  id :{value:hours,changed:bool}
 *  id :{value:hours,changed:bool}
 * }
 * }
 */
export const assignManagerHoursBulk = catchAsync(async (req, res, next) => {
  const { projectsHours, date } = req.body;
  if (!projectsHours || !date)
    return next(new MissingParameter("les heurs des projets sont obligatoire"));
  const projectsKeys = Object.keys(projectsHours);
  await isAllProjectsAreValid(projectsKeys, next);

  for (const idx in projectsKeys) {
    let userId;

    const project = await Project.findByPk(projectsKeys[idx]);

    if (req.user.role === PROJECT_MANAGER_ROLE) {
      if (req.user.id !== project.manager)
        return next(new UnAuthorized("Vous n’êtes pas le chef du ce projet"));
      userId = req.user.id;
    }
    if (req.user.isSuperUser && req.user.role === SUPERUSER_ROLE) {
      userId = project.manager;
    }
    const user = await User.findByPk(userId);
    if (!user)
      return next(new ElementNotFound("le chef projet est introuvable"));

    const hours = Math.round(
      parseInt(projectsHours[projectsKeys[idx]].value) / 60
    );
    if (isNaN(hours) || hours < 0)
      return next(
        new AppError("le nombre des heurs doit être un chiffre positif ", 400)
      );

    //  affecting hours per date
    const managedHours = await InterventionHour.findOne({
      where: { projectID: project.id, date: moment(date) }
    });

    if (managedHours) {
      if (hours === managedHours.nbHours) continue;
      managedHours.nbHours = hours;
    } else {
      await InterventionHour.create({
        hours: hours,
        projectID: project.id,
        date: moment(date)
      });
    }

    project.managerHours += hours;
    await project.save();
    await takeNote(
      ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS,
      req.user.email,
      project.id,
      {
        extraProps: {
          hours: hours
        }
      }
    );
  }

  return res
    .status(200)
    .json({ status: "success", message: "heurs renseigner avec succès" });
});

// export const assignManagerHours = catchAsync(async (req, res, next) => {
//   const { projectID } = req.params;
//   if (!projectID) return next(new MissingParameter("Missing project id"));
//   const project = await Project.findByPk(projectID);

//   if (!project) return next(new ElementNotFound("Projet introuvable"));
//   let userId;

//   if (req.user.role === PROJECT_MANAGER_ROLE) {
//     if (req.user.id !== project.manager)
//       return next(new UnAuthorized("Vous n’êtes pas le chef du ce projet"));
//     userId = req.user.id;
//   }

//   if (req.user.isSuperUser && req.user.role === SUPERUSER_ROLE) {
//     userId = req.body.user;
//   }
//   const user = await User.findByPk(userId);
//   if (!user) return next(new ElementNotFound("le chef projet est introuvable"));

//   const hours = parseInt(req.body.hours);
//   if (isNaN(hours) || hours < 0)
//     return next(
//       new AppError("le nombre des heurs doit être un chiffre positif ", 400)
//     );
//   if (hours < project.managerHours)
//     return next(
//       new AppError("vous ne pouvez pas diminuer votre nombre d'heures", 400)
//     );

//   project.managerHours = hours;

//   await project.save();
//   await takeNote(
//     ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS,
//     req.user.email,
//     project.id,
//     {
//       extraProps: {
//         hours: hours
//       }
//     }
//   );

//   return res
//     .status(200)
//     .json({ status: "success", message: "heurs renseigner avec succès" });
// });
export const abandonOrResumeProject = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;

  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);

  if (!project) return next(new ElementNotFound(`Project was not found`));
  let actionState =
    req.body.action === TASK_STATE_ABANDONED
      ? TASK_STATE_ABANDONED
      : TASK_STATE_DOING;
  abandonProject(actionState, project.id);
  project.state = actionState;
  await project.save();

  return res.status(200).json({
    message:
      actionState === TASK_STATE_ABANDONED
        ? "projet abandonné avec ses tâches"
        : 'le projet a été rouvert et toutes les tâches sont revenues au statut "en cours".'
  });
});

const abandonProject = async (action, projectID) => {
  try {
    let taskIds = await Intervenant.findAll({
      where: {
        projectID: projectID
      },
      attributes: ["taskID"]
    });
    if (taskIds.length) {
      let ids = [];
      taskIds.forEach(({ taskID }) => {
        if (!ids.includes(taskID)) ids.push(taskID);
      });
      let obj = {
        state: action
      };
      if (action === TASK_STATE_DONE)
        obj.doneDate = moment(new Date(), "DD/MM/YYYY");

      await Task.update(obj, {
        where: {
          id: ids
          //check if
        }
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

export const getProjectTracking = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;

  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);

  if (!project) return next(new ElementNotFound(`Project was not found`));
  const tracking = await getTracking(projectID);

  return res.status(200).json({ tracking });
});
