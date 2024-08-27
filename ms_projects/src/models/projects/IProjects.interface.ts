import {EState} from "models/enum";
import { Date, Types } from "mongoose";



export type TProject = {
  code: string;
  name: string;
  customID: string;
  startDate: String;
  dueDate: String;
  priority: string;
  createdBy: Types.ObjectId;
  phases: Types.ObjectId[];
  manager: {
    user: Types.ObjectId;
    hours: number;
  };
  tasks: Types.ObjectId[];
  active: boolean;
  state:EState
};

export interface IProject extends TProject, Document {}
