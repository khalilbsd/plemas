import mongoose, { Schema } from "mongoose";

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


const UserProfile =  mongoose.model('user_Profiles',UserProfileSchema)
// const UserProfile = getDb().model('user_Profiles',UserProfileSchema)

export default UserProfile;
