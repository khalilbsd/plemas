import mongoose, { Schema } from "mongoose";
import getDb from "../../db/db_mongo.js";
// "resetPasswordToken"
const ResetPasswordSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    expired: {
      type: Boolean,
      default: false,
      required: true
    },
    user: {
      type: Schema.ObjectId,
      ref: "users",
      required: true
    }
  },
  { timestamps: true }
);

// const ResetPasswordToken =  getDb().model('resetPasswordToken',ResetPasswordSchema)
const ResetPasswordToken = mongoose.model(
  "resetPasswordToken",
  ResetPasswordSchema
);

export default ResetPasswordToken;
