import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MissingParameter,
  UnAuthorized
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import {
  ACTION_NAME_ADD_INTERVENANT_PROJECT,
  ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT,
  ACTION_NAME_DELETE_INTERVENANT,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../constants/constants.js";
import { Project, Task, User, UserProfile } from "../../db/relations.js";
import { ForbiddenError } from "../../errors/http.js";
import logger from "../../log/config.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";
import { getUserByEmail } from "../users/lib.js";
import { takeNote } from "../../Utils/writer.js";
import { config } from "../../environment.config.js";
import { createMediaUrl } from "../../Utils/FileManager.js";

export const getAllIntervenants = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const projectExist = await Project.findByPk(projectID);
  if (!projectExist) return next(new ElementNotFound("projet introuvable"));

  const intervenants = await projectIntervenantList(projectID);

  if (!intervenants) {
    return res.status(200).json({ status: "success", intervenants: [] });
  }
  return res
    .status(200)
    .json({ status: "success", intervenants: intervenants });
});

export const projectIntervenantList = async (projectID) => {
  let grouped = [];
  const intervenants = await Intervenant.findAll({
    where: {
      projectID: projectID,
      intervenantID: { [Op.ne]: null }
    },

    include: [
      {
        model: User,
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["name", "lastName", "image"]
          }
        ]
      }
    ]
    // group: "intervenantID",
  });
  const formattedIntervenants = intervenants.map((item) => item.toJSON());
  formattedIntervenants.map((interv) => {
    let lineIdx = grouped
      .map((item) => item.intervenantID)
      .indexOf(interv.intervenantID);
    if (lineIdx > -1) {
      formattedIntervenants[lineIdx].nbHours += interv.nbHours;
    } else {
      grouped.push(interv);
    }
  });

  return grouped;
};

export const addIntervenantToProject = catchAsync(async (req, res, next) => {
  if (
    req.user.role !== SUPERUSER_ROLE &&
    req.user.role !== PROJECT_MANAGER_ROLE
  )
    return next(
      new ForbiddenError("vous n'êtes pas autorisé à faire cette action")
    );

  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("projet introuvable"));

  if (
    req.user.role === PROJECT_MANAGER_ROLE &&
    parseInt(project.manager) !== req.user.id
  ) {
    return next(new UnAuthorized("vous n'êtes pas le chef de ce projet"));
  }
  let intervenantsNames=""

  const { emails } = req.body;
  if (!emails) return next(new MissingParameter("Emails est requis"));

  for (const email in emails) {
    const user = await getUserByEmail(emails[email]);

    if (!user) return next(new ElementNotFound("utilisateur introuvable"));

    logger.info(
      `adding the user as an intervenant to the project ${projectID}`
    );

    const intervenant = await Intervenant.create({
      intervenantID: user.id,
      projectID: projectID
    });

    if (!intervenant) {
      logger.error(`failed to create`);
      return next(
        new AppError("La création a échoué, veuillez réessayer plus tard ")
      );
    }
    intervenantsNames = intervenantsNames.concat(user.email,", ")

  }

  if (emails.length > 1) {
    await takeNote(
      ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT,
      req.user.email,
      project.id,
      {extraProps:{
        intervenantsNames:intervenantsNames
      }}
    );
  } else if (emails.length) {
    await takeNote(
      ACTION_NAME_ADD_INTERVENANT_PROJECT,
      req.user.email,
      project.id,
      {extraProps:{
        intervenantsNames:emails[0]
      }}
    );
  }

  res.status(200).json({
    state: "success",
    message: "l'utilisateur est devenu un intervenant"
  });
});

export const removeIntervenantFromProject = catchAsync(
  async (req, res, next) => {
    //check if the user have the right to remove a intervenant
    if (
      req.user.role !== SUPERUSER_ROLE &&
      req.user.role !== PROJECT_MANAGER_ROLE
    )
      return next(
        new ForbiddenError("vous n'êtes pas autorisé à faire cette action")
      );

    const { projectID } = req.params;
    if (!projectID) return next(new MissingParameter("le projet est requis"));
    const project = await Project.findByPk(projectID);
    if (!project) return next(new ElementNotFound("projet introuvable"));
    const { email } = req.body;
    if (!email)
      return next(new MissingParameter("l'id de l'intervenant est requis"));

    if (
      req.user.role === PROJECT_MANAGER_ROLE &&
      parseInt(project.manager) !== req.user.id
    ) {
      return next(new UnAuthorized("vous n'êtes pas le chef de ce projet"));
    }
    //check if intervenant is a indeed withing this project
    const user = await User.findOne({ where: { email }, attributes: ["id"] });
    if (!user) return next(new ElementNotFound("intervenant non trouvé"));
    const intervenant = await Intervenant.findOne({
      where: { projectID, intervenantID: user.id }
    });
    if (!intervenant)
      return next(
        new AppError(
          "rien est change l'utilisateur n'est pas un intervenant dans ce projet",
          304
        )
      );
    // removing intervenant
    if (intervenant.nbHours > 0) {
      return next(
        new AppError("Vous ne pouvez pas retirer cet intervenant", 304)
      );
    }
    await takeNote(
      ACTION_NAME_DELETE_INTERVENANT,
      req.user.email,
      project.id,
      {
        extraProps:{
          deletedIntervenant:user.email
        }
      }
    );

    //TODO:: add task check rules
    await intervenant.destroy();
    res
      .status(200)
      .json({ status: "success", message: "intervenant retirer de projet" });
  }
);

export const uploadFileToTask = catchAsync(async (req, res, next) => {
  const { projectID, taskID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("let projet est introuvable"));

  if (!taskID) return next(new MissingParameter("la tache est requis"));
  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound("la tache est introuvable"));

  const intervention = await Intervenant.findOne({
    where: { projectID, taskID, intervenantID: req.user.id }
  });
  if (!intervention) return next("vous ne faites pas partie de cette tâche ");
  let url;

  if (!req.files)
    return next(new AppError("aucun fichier n'a été fourni", 422));
  //limit file  size    : 10 mo
  // for (const file in req.files)
  if (req.files[0].size > config.file_limit_size * 1024 * 1024)
    return next(new AppError("le fichier dépasse la limite de 5MB", 400));

  url = createMediaUrl(req.files[0]);

  //['item']
  let obj;
  if (intervention.file) {
    obj = JSON.parse(intervention.file);
    obj.push(url);
    intervention.file = JSON.stringify(obj);
  } else {
    obj = [url];
    intervention.file = JSON.stringify(obj);
  }
  await intervention.save();
  return res.status(200).json({
    status: "success",
    interventionID:intervention.id,
    message: "fichier attaché au tâche",
    file:JSON.stringify(obj)
  });
});
