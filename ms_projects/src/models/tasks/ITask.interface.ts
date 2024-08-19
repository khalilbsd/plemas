import { Types, Date } from "mongoose";
import {
  STATE_ABANDONED,
  STATE_BLOCKED,
  STATE_DONE,
  STATE_DOING,
  STATE_TODO
} from "../../constants/constants";

export enum TaskState {
  TODO = STATE_TODO,
  DOING = STATE_DOING,
  DONE = STATE_DONE,
  ABANDONED = STATE_ABANDONED,
  BLOCKED = STATE_BLOCKED
}

export type TTask = {
  name: String;
  startDate: Date;
  dueDate: Date;
  blockedDate: Date;
  doneDate: Date;
  totalHours: Number;
  state: TaskState;
  meta: Object;
  project: Types.ObjectId;
  intervenants:Types.ObjectId
    creator:Types.ObjectId
};
export interface ITask extends TTask, Document {}
