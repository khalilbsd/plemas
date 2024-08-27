import { Model, Schema } from "mongoose";
import { IPhase } from "./IPhase.interface";
import getDb from "../../db/db_mongo";

// Define the Mongoose model based on the IPhase interface
const PhaseSchema = new Schema({
    name: { type: String, required: true },
    abbreviation: { type: String, required: false },
    description:{
      type: String,
      required: false
    },
    default:{
      type:Boolean,
      required:false
    }
  });

  // Create the Mongoose model
  const Phase: Model<IPhase> = getDb().model<IPhase>('phases', PhaseSchema);

  export default Phase;