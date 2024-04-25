import { Model, Schema } from "mongoose";
import getDb from "../../db/db_mongo";
import { IUserProfile } from "./IUserProfile.interface";


export const userProfileModelName ="user_profiles"
const UserProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: false
    },
    poste: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    address: {
      type: String
    },
    hireDate: {
      type: String
    }
  },
  { timestamps: true }
);

const UserProfile: Model<IUserProfile> = getDb().model<IUserProfile>(
  "user_profiles",
  UserProfileSchema
);

export default UserProfile;
