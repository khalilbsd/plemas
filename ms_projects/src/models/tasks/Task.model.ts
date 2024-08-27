import { Model, Schema } from "mongoose";
import { STATE_TODO } from "../../constants/constants";
import getDb from "../../db/db_mongo";
import { ITask } from "./ITask.interface";
import {EState} from "models/enum";

const taskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  blockedDate: Date,
  doneDate: Date,
  totalHours: Number,
  state: {
    type: String,
    required: true,
    default: EState.TODO,
    enum:Object.values(EState)
  },
  meta: {
    type: Object,
    required: false
  },
  project: {
    type: Schema.ObjectId,
    ref: "projects",
    required: true
  },
  intervenants: {
    type: Schema.ObjectId,
    ref: "users",
    required: false
  },
  creator: {
    type: Schema.ObjectId,
    ref: "users",
    required: true
  }
});

const Task: Model<ITask> = getDb().model<ITask>("tasks", taskSchema);

export default Task;
