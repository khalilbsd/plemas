import mongoose, { Schema } from "mongoose";
import { INTERVENANT_ROLE } from "../../constants/constants.js";
// "users",
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: INTERVENANT_ROLE,
      required: true
    },
    isSuperUser: {
      type: Boolean,
      default: 0,
      required: false
    },
    token:{
      type:String,
      required:false
    },

    active:{
      type:Boolean,
      default:false,
      required:true
    },
    isBanned:{
      type:Boolean,
      default:false,
      required:true
    },
    firstLogin:{
      type:Boolean,
      default:false,
      required:true
    },
    profile:{
      type:Schema.ObjectId,
      ref:"user_Profiles",
      required:true
    },
    thirdPartyProvider:{
      type:String,
      required:true
    }
  },
  { timestamps: true }

);

const User = mongoose.model('users',UserSchema);
// const User = getDb().model('users',UserSchema);

export default User;
