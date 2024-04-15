import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const ThirdPartyProvider = database.define(
  "third_party_providers",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    publicKey: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    secretKey: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
  },
  { timestamps: true }
);



export default ThirdPartyProvider