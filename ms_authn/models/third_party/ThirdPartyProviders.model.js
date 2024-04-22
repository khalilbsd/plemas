import mongoose, { Schema } from "mongoose";
import getDb from "../../db/db_mongo.js";

const ThirdPartyProviderSchema = new Schema({
  name: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  secretKey: { type: String, required: true }
},{timestamps:true});

// export default getDb().model("third_party_providers", ThirdPartyProviderSchema);
export default  mongoose.model("third_party_providers", ThirdPartyProviderSchema);
