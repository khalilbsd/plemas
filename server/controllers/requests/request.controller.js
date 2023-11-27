import { createMediaUrl } from "../../Utils/FileManager.js";
import {
  AppError,
  ElementNotFound,
  MissingParameter,
  UnAuthorized
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { takeNote } from "../../Utils/writer.js";
import {
  ACTION_NAME_ADMIN_REQUEST_DELETE,
  ACTION_NAME_REQUEST_CREATION,
  ACTION_NAME_REQUEST_STATE_CHANGED,
  ACTION_NAME_REQUEST_UPDATE,
  PROJECT_MANAGER_ROLE
} from "../../constants/constants.js";
import { Project, Request, User, UserProfile } from "../../db/relations.js";
import { config } from "../../environment.config.js";
import logger from "../../log/config.js";
import { serializeRequest, serializeRequestList } from "./lib.js";

export const getAllRequests = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);

  if (!project) return next(new ElementNotFound("Projet introuvable"));
  const requests = await Request.findAll({
    where: { projectID },
    include: [
      {
        model: User,
        as: "requestCreator",
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["image", "name", "lastName"]
          }
        ]
      }
    ]
  });
  const serializedRequest = serializeRequestList(requests);
  return res
    .status(200)
    .json({ status: "success", requests: serializedRequest });
});
export const createRequest = catchAsync(async (req, res, next) => {
  // const { projectID } = req.params;
  const data = req.body;

  if (!data.projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(data.projectID);
  if (!project) return next(new ElementNotFound("Projet introuvable"));

  data.creatorID = req.user.id;
  logger.info(
    `creating request for project: ${data.projectID}  ${project.customId}`
  );
  //file

  //  let  url = createMediaUrl(req.file);

  // constructing urls  :
  if (req.files.length) {
    let urls = [];
    for (const file in req.files) {
      if (req.files[file].size > config.file_limit_size * 1024 * 1024)
        return next(new AppError("le fichier dépasse la limite de 5MB", 400));

      let url = createMediaUrl(req.files[file]);
      urls.push(url);
    }

    data.file = JSON.stringify(urls);
  }
  const request = await Request.create({ ...data });
  if (!request)
    return next(new AppError("quelque chose n'a pas fonctionné", 500));
  await request.reload({
    include: [
      {
        model: User,
        as: "requestCreator",
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["image", "name", "lastName"]
          }
        ]
      }
    ]
  });
  await takeNote(ACTION_NAME_REQUEST_CREATION, req.user.email, project.id, {
    requestID: request.id
  });

  return (
    res
      //formatting the request obj
      .status(200)
      .json({
        status: "success",
        newRequest: serializeRequest(request),
        message: "requête créée avec succès"
      })
  );
});
export const updateRequest = catchAsync(async (req, res, next) => {
  const { projectID, requestID } = req.params;
  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("Projet introuvable"));

  const request = await Request.findByPk(requestID, { where: { projectID } });
  if (!request) return next(new ElementNotFound("Requête introuvable"));
  if (!req.user.isSuperUser && req.user.role !== PROJECT_MANAGER_ROLE) {
    //check if the user is the manager of the project
    if (request.creatorID !== req.user.id)
      return next(
        new UnAuthorized("Vous n’êtes pas le créateur de cette requête")
      );
  }
  if (req.user.role === PROJECT_MANAGER_ROLE && project.manager !== req.user.id)
    return next(new UnAuthorized("Vous n’êtes pas le  chef de ce projet"));
  console.log(req.body);
  const oldState = request.state;
  await request.update({ ...req.body });
  if (req.body.state !== oldState) {
    await takeNote(
      ACTION_NAME_REQUEST_STATE_CHANGED,
      req.user.email,
      project.id,
      { requestID: request.id }
    );
  } else {
    await takeNote(ACTION_NAME_REQUEST_UPDATE, req.user.email, project.id, {
      requestID: request.id
    });
  }

  return res.status(200).json({
    message: "requête mis à jour",
    request: serializeRequest(await request.reload())
  });
});

export const deleteRequest = catchAsync(async (req, res, next) => {
  const { projectID, requestID } = req.params;
  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("Projet introuvable"));

  const request = await Request.findByPk(requestID, { where: { projectID } });
  if (!request) return next(new ElementNotFound("Requête introuvable"));
  await request.destroy();
  await takeNote(ACTION_NAME_ADMIN_REQUEST_DELETE, req.user.email, project.id, {
    requestID: request.id
  });

  return res
    .status(200)
    .json({ status: "success", message: "Requête supprimé" });
});

// export const changeRequestState = catchAsync(async (req, res, next) => {});

// export const getCreatorRequests = catchAsync(async (req, res, next) => {});

export const uploadFileToRequest = catchAsync(async (req, res, next) => {
  const { projectID, requestID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("let projet est introuvable"));

  if (!requestID) return next(new MissingParameter("la requete est requis"));
  const request = await Request.findByPk(requestID);
  if (!request) return next(new ElementNotFound("requete est introuvable"));
  if (request.creatorID !== req.user.id)
    return AppError("cette demande ne vous appartient pas ");

  let url;
  if (!req.files.length)
    return next(new AppError("aucun fichier n'a été fourni", 422));
  //limit file  size    : 10 mo
  let urls = request.file ? JSON.parse(request.file) : [];

  for (const file in req.files) {
    if (req.files[file].size > config.file_limit_size * 1024 * 1024)
      return next(new AppError("le fichier dépasse la limite de 5MB", 400));

    url = createMediaUrl(req.files[file]);
    urls.push(url);
  }

  request.file = JSON.stringify(urls);

  await request.save();
  return res.status(200).json({
    status: "success",
    message: "fichiers attaché au requete",
    files:urls,
  });
});
