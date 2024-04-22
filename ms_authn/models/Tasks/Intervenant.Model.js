import mongoose, { Schema } from "mongoose";

const intervenantSchema = new Schema(
  {
    nbHours: {
      type: Number,
      required: false,
      defaultValue: 0
    },
    file: {
      type: String,
      required: false
    },
    user:{}
  },
  { timestamps: true }
);

const Intervenant = mongoose.model("intervenant", intervenantSchema);

export default Intervenant;
