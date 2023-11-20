import { AppError, ElementNotFound, MissingParameter, UnAuthorized } from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { takeNote } from "../../Utils/writer.js";
import { ACTION_NAME_ADMIN_REQUEST_DELETE, ACTION_NAME_REQUEST_CREATION, ACTION_NAME_REQUEST_STATE_CHANGED, ACTION_NAME_REQUEST_UPDATE, PROJECT_MANAGER_ROLE } from "../../constants/constants.js";
import { Project, Request, User, UserProfile } from "../../db/relations.js";
import logger from "../../log/config.js";
import { serializeRequest, serializeRequestList } from "./lib.js";

export const getAllRequests = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);

  if (!project) return next(new ElementNotFound("Projet introuvable"));
  const requests = await Request.findAll({ where: { projectID } ,
    include:[
      {
        model:User,
        as:'requestCreator',
        attributes: ["email"],
        include:[{
          model: UserProfile,
          attributes: ["image", "name", "lastName"]
        }]
      }
    ]
  });
  const serializedRequest = serializeRequestList(requests);
  return res.status(200).json({ status: "success", requests:serializedRequest });
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
  const request = await Request.create({ ...data });
  if (!request)
    return next(new AppError("quelque chose n'a pas fonctionné", 500));
    await request.reload({include:[
      {
        model:User,
        as:'requestCreator',
        attributes: ["email"],
        include:[{
          model: UserProfile,
          attributes: ["image", "name", "lastName"]
        }]
      }
    ]});
  await takeNote(ACTION_NAME_REQUEST_CREATION,req.user.email,project.id,{requestID:request.id})

    return res
    //formatting the request obj
    .status(200)
    .json({
      status: "success",
      newRequest: serializeRequest(request),
      message: "requête créée avec succès"
    });
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
  const oldState = request.state
  await request.update({ ...req.body });
  if (req.body.state !== oldState){
    await takeNote(ACTION_NAME_REQUEST_STATE_CHANGED,req.user.email,project.id,{requestID:request.id})

  }else{
    await takeNote(ACTION_NAME_REQUEST_UPDATE,req.user.email,project.id,{requestID:request.id})

  }

  return res.status(200).json({ message: "requête mis à jour" });
});

export const deleteRequest =catchAsync(async (req,res,next)=>{
    const { projectID, requestID } = req.params;
  if (!projectID) return next(new MissingParameter("Missing project id"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("Projet introuvable"));

  const request = await Request.findByPk(requestID, { where: { projectID } });
  if (!request) return next(new ElementNotFound("Requête introuvable"));
    await request.destroy();
    await takeNote(ACTION_NAME_ADMIN_REQUEST_DELETE,req.user.email,project.id,{requestID:request.id})

    return res.status(200).json({status:"success",message:"Requête supprimé"})

})


// export const changeRequestState = catchAsync(async (req, res, next) => {});

// export const getCreatorRequests = catchAsync(async (req, res, next) => {});
