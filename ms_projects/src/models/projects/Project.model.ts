import { Model, Schema } from "mongoose";
import getDb from "../../db/db_mongo";
import { IProject } from "./IProjects.interface";

const projectSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
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
      required: false
    },
    priority: {
      type: Number,
      required: true
    },
    createdBy: { type: Schema.ObjectId, ref: "users", required: true },
    phases: [
      {
        type: Schema.ObjectId,
        ref: "phases"
      }
    ],
    manager: {
      user: {
        type: Schema.ObjectId,
        ref: "users",
        required: true
      },
      hours: {
        type: Number,
        required: true,
        default: 0
      }
    },
    tasks: [{ type: Schema.ObjectId, ref: "tasks" }],
    active: Boolean
  },
  { timestamps: true }
);

const Project: Model<IProject> = getDb().model<IProject>(
  "projects",
  projectSchema
);

export default Project;
