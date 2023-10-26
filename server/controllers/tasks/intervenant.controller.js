import {
  AppError,
  ElementNotFound,
  MissingParameter
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { Project, User, UserProfile } from "../../db/relations.js";
import logger from "../../log/config.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";
import { getUserByEmail } from "../users/lib.js";

export const getAllIntervenants = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));

  const project = await Project.findByPk(projectID, {
    include: [
      {
        model: Intervenant,
        as:"intervenants",

        include: [
          {
            model: User,

            attributes: ["email"],
            include: [
              {
                model: UserProfile,
                attributes: ["name", "lastName"]
              }
            ]
          }
        ]
      }
    ]
  });
  if (!project) return next(new ElementNotFound("projet introuvable"));

  res.status(200).json({status:"success",intervenant:project.intervenants});

});
export const addIntervenantToProject = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));

  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("projet introuvable"));

  const { email } = req.body;
  console.log("EMAIL");
  if (!email) return next(new MissingParameter("Email est requis"));

  const user = await getUserByEmail(email);

  if (!user) return next(new ElementNotFound("utilisateur introuvable"));

  logger.info(`adding the user as an intervenant to the project ${projectID}`);

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
  res
    .status(200)
    .json({
      state: "success",
      message: "l'utilisateur est devenu un intervenant"
    });
});
