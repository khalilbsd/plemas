import { Date, Types } from "mongoose";

export type TProject = {
  code: string;
  customId: string;
  name: string;
  startDate: Date;
  dueDate: Date;
  priority: string;
  createdBy: Types.ObjectId;
  phases: Types.ObjectId[];
  manager: {
    user: Types.ObjectId;
    hours: number;
  };
  tasks: Types.ObjectId[];
  active: boolean;
};

export interface IProject extends TProject, Document {}
