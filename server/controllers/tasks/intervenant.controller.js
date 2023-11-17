import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MissingParameter,
  UnAuthorized
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import {
  ACTION_NAME_ADD_INTERVENANT,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../constants/constants.js";
import { Project, User, UserProfile } from "../../db/relations.js";
import { ForbiddenError } from "../../errors/http.js";
import logger from "../../log/config.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";
import { getUserByEmail } from "../users/lib.js";
import { takeNote } from "../../Utils/writer.js";

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
  let grouped= []
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
    ],
    // group: "intervenantID",
  });
  const formattedIntervenants = intervenants.map(item=>item.toJSON())
  formattedIntervenants.map(interv=>{
  let lineIdx = grouped.map(item=>item.intervenantID).indexOf(interv.intervenantID)
  if (lineIdx > -1) {
    formattedIntervenants[lineIdx].nbHours +=interv.nbHours
  }else{
    grouped.push(interv)
  }

  })

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
  await takeNote(ACTION_NAME_ADD_INTERVENANT,req.user.email,project.id)

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
    //TODO:: add task check rules
    await intervenant.destroy();
    res
      .status(200)
      .json({ status: "success", message: "intervenant retirer de projet" });
  }
);
