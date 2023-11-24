import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MissingParameter,
  UnAuthorized
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { Intervenant, Project, User, UserProfile } from "../../db/relations.js";
import Task from "../../models/tasks/tasks.model.js";
import moment from "moment";
import logger from "../../log/config.js";
import {
  ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,
  ACTION_NAME_ADD_INTERVENANT_TASK,
  ACTION_NAME_ASSIGN_INTERVENANT_HOURS,
  ACTION_NAME_INTERVENANT_JOINED_TASK,
  ACTION_NAME_TASK_CREATION,
  ACTION_NAME_TASK_STATE_CHANGED,
  ACTION_NAME_TASK_UPDATE,
  ACTION_NAME_VERIFY_TASK,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE,
  TASK_STATE_ABANDONED,
  TASK_STATE_BLOCKED,
  TASK_STATE_DOING,
  TASK_STATE_TRANSLATION
} from "../../constants/constants.js";
import { projectIntervenantList } from "./intervenant.controller.js";
import { projectPotentialIntervenants } from "../users/user.controller.js";
import InterventionHour from "../../models/tasks/interventionHours.model.js";
import { takeNote } from "../../Utils/writer.js";

/*
 * params [projectID] REQUIRED
 */
export const getProjectTasks = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("le projet est introuvable"));
  // test
  let tasks = await Task.findAll({
    include: [
      {
        model: Intervenant,
        where: { projectID: projectID },
        include: [
          {
            model: User,
            attributes: ["email", "role"],
            include: [
              {
                model: UserProfile,
                attributes: ["name", "lastName", "image"]
              }
            ]
          }
        ]
      }
    ],
    order: [["dueDate", "DESC"]]
  });

  tasks = tasks.map((task) => {
    if (task.intervenants.length === 0 || !task.intervenants[0].user) {
      task.intervenants = [];
    }
    task.state = TASK_STATE_TRANSLATION.filter(
      (state) => state.value === task.state
    )[0].label;
    return task;
  });

  return res.status(200).json({
    intervenants: tasks
  });
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
  if (data.startDate > data.dueDate)
    return next(
      new AppError(
        "la date d'échéance doit être supérieure à la date de début",
        400
      )
    );
  if (data.startDate < project.startDate) return next(new AppError("la date de début de la tâche ne peut pas être antérieure à la date de début du projet"))

  const task = await Task.create({ ...data });
  let message = "la tâche a été créée avec succès";
  await takeNote(ACTION_NAME_TASK_CREATION,req.user.email,project.id,{taskID:task.id})
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

    if (req.body.intervenants.length > 1 ){
      await takeNote(ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,req.user.email,project.id,{taskID:task.id})
    }else if (req.body.intervenants){
      await takeNote(ACTION_NAME_ADD_INTERVENANT_TASK,req.user.email,project.id,{taskID:task.id})

    }

  } else {
    await Intervenant.create({
      projectID: projectID,
      taskID: task.id
    });
  }
  await task.reload({
    include: [
      {
        model: Intervenant,
        where: { projectID: projectID },
        include: [
          {
            model: User,
            attributes: ["email", "role"],
            include: [
              {
                model: UserProfile,
                attributes: ["name", "lastName", "image"]
              }
            ]
          }
        ]
      }
    ]
  });
  task.state = TASK_STATE_TRANSLATION.filter(
    (state) => state.value === task.state
  )[0].label;

  return res.status(200).json({ status: "success", message, task });
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
  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound("la tache est introuvable"));

  if (
    ![SUPERUSER_ROLE, PROJECT_MANAGER_ROLE].includes(req.user.role) ||
    !req.body.emails
  ) {
    //check if there is an empty intervention
    const empty = await Intervenant.findOne({
      where: { intervenantID: { [Op.eq]: null }, projectID, taskID }
    });
    if (empty) {
      empty.intervenantID = req.user.id;
      await empty.save();
      logger.info(
        `intervenant has been associated to task ${taskID} in the project ${projectID}`
      );

    await takeNote(ACTION_NAME_INTERVENANT_JOINED_TASK,req.user.email,project.id,{taskID})

      return res.status(200).json({
        status: "success",
        message: "vous avez été assigné à la tâche"
      });
    } else {
      const [intervenant, created] = await Intervenant.findOrCreate({
        where: {
          intervenantID: req.user.id,
          projectID: projectID,
          taskID
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
      // intervenant.taskID = taskID;
      // await intervenant.save();
      logger.info(
        `intervenant has been associated to task ${taskID} in the project ${projectID}`
      );
      await takeNote(ACTION_NAME_INTERVENANT_JOINED_TASK,req.user.email,project.id,{taskID})
      return res.status(200).json({
        status: "success",
        message: "vous avez été assigné à la tâche"
      });
    }
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

    const empty = await Intervenant.findOne({
      where: { intervenantID: { [Op.eq]: null }, projectID, taskID }
    });
    if (empty) {
      empty.intervenantID = user.id;
      await empty.save();
      logger.info(
        `intervenant has been associated to task ${taskID} in the project ${projectID}`
      );
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

  if (emails.length > 1 ){
    await takeNote(ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,req.user.email,project.id,{taskID})
  }else if (emails.length){
    await takeNote(ACTION_NAME_ADD_INTERVENANT_TASK,req.user.email,project.id,{taskID})

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
  const { taskID, hours, date } = req.body;
  if (!taskID || hours === undefined || !date)
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
      new ElementNotFound(
        "l'intervenant n'est pas inclut dans cette tache du projet"
      )
    );
    const interventionHours = await InterventionHour.findOne({
      where: { interventionID: intervention.id, date: moment(date) }
    });



  if (parseInt(hours) === intervention.nbHours && interventionHours)
    return next(new AppError("rien n'est modifié", 304));
  if (parseInt(hours) < 0)
    return next(new AppError("le nombres des heures doit être positive"));



    console.log("------------------------- found intervention ",interventionHours)
  if (interventionHours){
    task.totalHours = task.totalHours
    ? task.totalHours + (parseInt(hours) - interventionHours.hours)
    : parseInt(hours);
    intervention.nbHours = intervention.nbHours + ( parseInt(hours) - interventionHours.hours);
    // intervention.nbHours = parseInt(hours);
  }else{
    task.totalHours = task.totalHours? task.totalHours + parseInt(hours) : parseInt(hours)

    intervention.nbHours = intervention.nbHours + parseInt(hours)
    console.log("------------------------- NOT FOUND  intervention ",intervention.nbHours, parseInt(hours) ,intervention.nbHours + parseInt(hours))

  }

  await task.save();
  await intervention.save();

  logger.info(
    `updating the hours number of the intervenant ${req.user.id} on the task ${task.id} in the project ${project.id}`
  );

  if (interventionHours) {
    interventionHours.hours = parseInt(hours);
    await interventionHours.save();
  } else {
    await InterventionHour.create({
      hours: hours,
      interventionID: intervention.id,
      date: moment(date)
    });
  }
  await takeNote(ACTION_NAME_ASSIGN_INTERVENANT_HOURS,req.user.email,project.id,{taskID:task.id})

  res.status(200).json({
    status: "success",
    message: "horaires de travail mis à jour avec succès"
  });
});

export const getDailyTasks = catchAsync(async (req, res, next) => {
  //my tasks
  let history;
  if (!req.query.history) {
    // history = new Date()
    history = moment();
  } else {
    history = moment(req.query.history, "DD/MM/YYYY");
  }

  const allTasksRaw = await Intervenant.findAll({
    where: { intervenantID: req.user.id },
    include: [
      {
        model: Project,
        attributes: ["id", "customId", "name"]
      },
      {
        model: Task,

        where: {
          state: TASK_STATE_DOING,
          // startDate: {
          //   [Op.lte]: history
          // }
        },
        as: "task"
      }
    ]
  });
  //convert tasks data to json
  let allTasks = allTasksRaw.map((t) => t.toJSON());

  // projects tasks that i can join  : divided from all tasks (taskID === null)
  let joinableTasks = allTasks.filter((t) => !t.taskID);
  let otherTasks = [];
  for (const idx in allTasks) {
    let projectExist = otherTasks.filter(
      (item) => item.projectID === allTasks[idx].projectID
    );
    if (projectExist.length) continue;
    let taskTreeRaw = await Intervenant.findAll({
      where: {
        projectID: allTasks[idx].projectID,
        taskId: {
          [Op.ne]: allTasks[idx].taskID
        }
        // intervenantID:{
        //   [Op.ne]:req.user.id
        // }
      },
      group: "taskID",
      include: [
        {
          model: Project,
          attributes: ["id", "customId", "name"]
        },
        {
          model: Task,

          where: { state: TASK_STATE_DOING },
          as: "task"
        }
      ]
    });

    let tasksTree = taskTreeRaw.map((t) => t.toJSON());
    // console.log("TASKS TREEEEEE" ,tasksTree.length)

    otherTasks = otherTasks.concat(tasksTree);
  }

  //  console.log(otherTasks)
  let tmp = [];
  otherTasks.map((t) => {
    let clear = true;
    for (const i in allTasks) {
      if (allTasks[i].taskID === t.taskID) {
        clear = false;
        return;
      }
    }
    if (clear) tmp.push(t);
  });

  joinableTasks = joinableTasks.concat(tmp);
  //  joinableTasks = joinableTasks.concat(otherTasks)



  for (const index in allTasks) {
    let interventionHours = await InterventionHour.findOne({
      where: { interventionID: allTasks[index].id, date: history }
    });
    if (interventionHours) {
      allTasks[index].nbHours = interventionHours.hours;
    } else {
      allTasks[index].nbHours = 0;
    }
  }

  return res.status(200).json({ joinableTasks, allTasks });
});

export const getTaskPotentialIntervenants = catchAsync(
  async (req, res, next) => {
    const { projectID } = req.params;

    if (!projectID) return next(new MissingParameter(" projet sont requise"));
    const project = await Project.findByPk(projectID);
    if (!project) return next(new ElementNotFound("le projet est introuvable"));
    const projectIntervenants = await projectIntervenantList(projectID);
    // let intervenants = [];
    let serializedIntervenant = [];
    if (projectIntervenants) {
      // intervenants = projectIntervenants.intervenants;
      serializedIntervenant = projectIntervenants.map((worker) => {
        return {
          id: worker.intervenantID,
          email: worker?.user?.email,
          name: worker?.user?.UserProfile?.name,
          lastName: worker?.user?.UserProfile?.lastName,
          image: worker?.user?.UserProfile?.image
        };
      });
    }
    // return next(new AppError("quelque chose n'a pas fonctionné"));

    const { taskID } = req.body;

    const potentialIntervenants = await projectPotentialIntervenants(projectID);
    if (!potentialIntervenants)
      return next(AppError("quelque chose n'a pas fonctionné"));
    const potentialAndProjectIntervenants = serializedIntervenant.concat(
      potentialIntervenants
    );

    if (!taskID) {
      //concat the two list to have full list of user that can be part of the project or not
      return res.status(200).json({
        status: "success",
        potentials: potentialAndProjectIntervenants
      });
    }

    const task = await Task.findByPk(taskID, {
      attributes: ["id", "name"],
      include: [
        {
          model: Intervenant,
          attributes: ["nbHours", "intervenantID"],
          where: { projectID: projectID },
          include: [
            {
              model: User,
              attributes: ["email", "role"],
              include: [
                {
                  model: UserProfile,
                  attributes: ["name", "lastName", "image"]
                }
              ]
            }
          ]
        }
      ]
    });
    if (!task) return next(new ElementNotFound("la tache est introuvable"));
    const { intervenants: taskIntervenants } = task;

    const filteredIntervenants = potentialAndProjectIntervenants.filter(
      (user) =>
        !taskIntervenants.map((task) => task.intervenantID).includes(user.id)
    );

    return res.json({
      state: "success",
      taskID: task.id,
      taskPotentials: filteredIntervenants
    });
  }
);

export const updateTaskInfo = catchAsync(async (req, res, next) => {
  const { taskID,projectID } = req.params;
  if (!taskID) return next(new MissingParameter("la tache est requise"));
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("let projet est introuvable"));

  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound("la tache est introuvable"));
  let data = {};
  if ([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE].includes(req.user.role)) {
    data = req.body;
    delete data.id;
  }
  if (req.body.state) {
    data.state = TASK_STATE_TRANSLATION.filter(
      (state) => state.label === req.body.state
    )[0].value;
  }
  if (data.state === TASK_STATE_BLOCKED) {
    project.state = TASK_STATE_BLOCKED
    await project.save()
  }
  const oldState = task.state
  const isAlreadyVerified = task.isVerified
  await task.update({ ...data });

  if (!isAlreadyVerified && data.isVerified ){
    await takeNote(ACTION_NAME_VERIFY_TASK,req.user.email,projectID,{taskID:task.id})
  }else if ((data.state)&& (data.state !== oldState)){
    await takeNote(ACTION_NAME_TASK_STATE_CHANGED,req.user.email,projectID,{taskID:task.id})
  }else{
    await takeNote(ACTION_NAME_TASK_UPDATE,req.user.email,projectID,{taskID:task.id})

  }
  // console.log("---------------*--------------------",data.state ,oldState , (data.state)&& (data.state !== oldState))


  logger.info(`updating the task ${task.id}`);
  return res
    .status(200)
    .json({ status: "succuss", message: "tache mis a jours" });
});
