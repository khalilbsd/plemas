import { Request } from "express";
import logger from "log/config";
import { IProject } from "models/projects/IProjects.interface";
import Project from "models/projects/Project.model";
import moment from "moment";
import { getPhaseById } from "services/phase/phase.service";

export const isCodeValid = async (code: String) => {
  const test = await Project.exists({ code });
  console.log(test);
  return test;
};

export const generateProjectCustomID = (
  projectCode: String,
  projectName: String,
  abbreviation: String
) => {
  return `${projectCode}${abbreviation.toUpperCase()}_${projectName}`;
};

export const createProject = async (
  req: Request,
  project: IProject
): Promise<IProject | null> => {
  try {
    project.createdBy = req.user!._id;
    const phase = await getPhaseById(project.phases[0]);
    project.customID = generateProjectCustomID(
      project.code,
      project.name,
      phase!.abbreviation
    );
    //TODOO: add the logs functions here and test the api
    const createdProject = await Project.create(project);
    // populating the project

    return (
      await createdProject.populate({ path: "manager.user", select: ['email','profile'] })
    ).populate({ path: "manager.user.profile", select: ["name","lastName","poste"] });
  } catch (error) {
    logger.error(error);
    return null;
  }
};
