import { Model, Schema } from "mongoose";
import getDb from "../../db/db_mongo";
import { IProject } from "./IProjects.interface";
import { EState } from "models/enum";

const projectSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    customID: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      required: true,
    },
    createdBy: { type: Schema.ObjectId, ref: "users", required: true },
    phases: [
      {
        type: Schema.ObjectId,
        ref: "phases",
      },
    ],
    manager: {
      user: {
        type: Schema.ObjectId,
        ref: "users",
        required: true,
      },
      hours: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    tasks: [{ type: Schema.ObjectId, ref: "tasks" }],
    active: Boolean,
    state: {
      type: String,
      default: EState.TODO,
      enum: Object.values(EState),
    },
  },
  { timestamps: true }
);

// projectSchema.pre("save", function (this, next) {
//   console.log(" this is befroe the save ",this);
//   return

// });

const Project: Model<IProject> = getDb().model<IProject>(
  "projects",
  projectSchema
);

export default Project;
