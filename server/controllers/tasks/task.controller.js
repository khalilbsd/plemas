import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MissingParameter,
  UnAuthorized
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { Intervenant, Project, User } from "../../db/relations.js";
import Task from "../../models/tasks/tasks.model.js";
import moment from "moment";
import logger from "../../log/config.js";
import {
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../constants/constants.js";

/*
 * params [projectID] REQUIRED
 */
export const getProjectTasks = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID, {
    attributes: ["id", "name"],
    include: [
      {
        model: Intervenant,
        where: {
          taskID: {
            [Op.ne]: null
          }
        },
        include: [Task, User]
      }
    ]
  });
  if (!project) return next(new ElementNotFound("le projet est introuvable"));

  return res.status(200).json({ intervenants: project.intervenants });
});
/*

* params [projectID] REQUIRED
* body :{
    * ******** REQUIRED
    * name:"devlop app",
    * startDate: 12/12/2023,
    * dueDate":31/12/2024  ,
    * *********OPTIONAL
    * intervenants":[
    *        "khalilbensaid98@gmail.com",
    *        "houssem.badr@gmail.com"
    *]
 * }
 *
 */

export const createTask = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("le projet est introuvable"));
  const { name, startDate, dueDate } = req.body;
  if (!name || !startDate || !dueDate)
    return next(
      new MissingParameter(
        "nome du tache/ date debut / data déchéance sont requis "
      )
    );
  // details.startDate = moment(details.startDate, "DD/MM/YYYY");
  if (req.user === PROJECT_MANAGER_ROLE && project.manager !== req.user.id) {
    return next(new UnAuthorized("vous n'est pas le chef de ce projet"));
  }

  const data = req.body;
  data.startDate = moment(startDate, "DD/MM/YYYY");
  data.dueDate = moment(dueDate, "DD/MM/YYYY");

  const task = await Task.create({ ...data });
  let message = "la tâche a été créée avec succès";
  if (req.body.intervenants) {
    for (const idx in req.body.intervenants) {
      const user = await User.findOne({
        where: { email: req.body.intervenants[idx] }
      });
      await Intervenant.create({
        intervenantID: user.id,
        projectID: projectID,
        taskID: task.id
      });
    }
    message += " et les intervenants sont associé";
  }
  return res.status(200).json({ status: "success", message });
});

/*
 * params [projectID]
 * body :{
 *  taskID:integer,
 * emails:[string]
 * }
 *
 */

export const associateIntervenantToTask = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("let projet est introuvable"));

  const { taskID } = req.body;
  if (!taskID) return next(new MissingParameter("la tache est requis"));
  const task = await Task.findByPk(projectID);
  if (!task) return next(new ElementNotFound("la tache est introuvable"));

  if (![SUPERUSER_ROLE, PROJECT_MANAGER_ROLE].includes(req.user.role)) {
    const [intervenant, created] = await Intervenant.findOrCreate({
      where: {
        intervenantID: req.user.id,
        projectID: projectID
      },
      defaults: {
        projectID,
        taskID,
        intervenantID: req.user.id
      }
    });

    if (created) {
      logger.info("new intervenant has been created ");
    }
    if (intervenant && intervenant.taskID === taskID) {
      logger.info("User is already part of this project and this task");
    }
    intervenant.taskID = taskID;
    await intervenant.save();
    logger.info(
      `intervenant has been associated to task ${taskID} in the project ${projectID}`
    );

    return res
      .status(200)
      .json({ status: "success", message: "vous avez été assigné à la tâche" });
  }

  const { emails } = req.body;
  if (!emails)
    return next(new MissingParameter("la list des emails est requis"));
  if (!emails.length) {
    logger.info("nothing to do emails list is empty ");
    return next(new AppError("aucun changement n'a été apporté", 304));
  }

  for (const idx in emails) {
    const user = await User.findOne({ where: { email: emails[idx] } });
    if (!user) {
      logger.error("User was not found");
      continue;
    }

    const [intervenant, created] = await Intervenant.findOrCreate({
      where: {
        intervenantID: user.id,
        projectID: projectID
      },
      defaults: {
        projectID,
        taskID,
        intervenantID: user.id
      }
    });

    if (created) {
      logger.info("new intervenant has been created ");
      continue;
    }

    if (intervenant && intervenant.taskID === taskID) {
      logger.info("User is already part of this project and this task");
      continue;
    }
    intervenant.taskID = taskID;
    await intervenant.save();
    logger.info(
      `intervenant has been associated to task ${taskID} in the project ${projectID}`
    );
  }

  return res
    .status(200)
    .json({ status: "success", message: "intervenants associé au tache" });
});

/*
 * params [projectID]
 * body :{
 *  taskID:integer,
 * hours:int
 * }
 *
 */

export const updateIntervenantHours = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("let projet est introuvable"));
  const { taskID, hours } = req.body;
  if (!taskID || !hours)
    return next(new MissingParameter("la tache et les heurs sont requis"));

  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound("la tache est introuvable"));
  const intervention = await Intervenant.findOne({
    where: {
      taskID: task.id,
      intervenantID: req.user.id,
      projectID: project.id
    }
  });


  if (!intervention)
    return next(
      new ElementNotFound("l'intervenant n'est pas inclut dans cette tache du projet")
    );

  if (parseInt(hours) === intervention.nbHours ) return next( new AppError("rien n'est modifié",304))
  if (parseInt(hours) < 0 ) return next(new AppError("le nombres des heures doit être positive"))
  intervention.nbHours = parseInt(hours);
  await intervention.save();
  logger.info(
    `updating the hours number of the intervenant ${req.user.id} on the task ${task.id} in the project ${project.id}`
  );
  res
    .status(200)
    .json({
      status: "success",
      message: "horaires de travail mis à jour avec succès"
    });
});


export const updateTaskInfo = catchAsync (async(req,res,next)=>{
    const {taskID} = req.params
    if (!taskID) return next(new MissingParameter("la tache est requise"));
    const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound("la tache est introuvable"));
  await task.update({...req.body})
  logger.info(`updating the task ${task.id}`)
  return res.status(200).json({status:"succuss",message:"tache mis a jours"})
})


export const getDailyTasks = catchAsync(async (req, res, next) => {});
