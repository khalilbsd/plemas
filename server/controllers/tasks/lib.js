import { ElementNotFound } from "../../Utils/appError.js";
import { Task } from "../../db/relations.js";
import { isProjectExist } from "../projects/lib.js";

export async function isAllProjectsAreValid(projectList, next) {
  for (const idx in projectList) {
    const isValid = await isProjectExist(projectList[idx]);
    if (!isValid) return next( new ElementNotFound(`projet ${projectList[idx]} est introuvable`));
  }
  return true;
}

export async function isAllTasksAreValid(taskList, next) {
  for (const idx in taskList) {
    const isValid = await isTaskExist(taskList[idx]);
    if (!isValid) return next( new ElementNotFound(`tache ${taskList[idx]}  est introuvable`));
  }
  return true;
}

export async function isTaskExist(taskID) {
  const task = await Task.findByPk(taskID);
  if (!task) return null;

  return true;
}
