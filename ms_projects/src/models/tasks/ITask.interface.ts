import { EState } from "models/enum";
import { Types, Date } from "mongoose";

export type TTask = {
  name: String;
  startDate: Date;
  dueDate: Date;
  blockedDate: Date;
  doneDate: Date;
  totalHours: Number;
  state: EState;
  meta: Object;
  project: Types.ObjectId;
  intervenants: Types.ObjectId;
  creator: Types.ObjectId;
};
export interface ITask extends TTask, Document {}
