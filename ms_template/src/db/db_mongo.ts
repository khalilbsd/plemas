// db.js
import mongoose, { Connection, ConnectOptions } from "mongoose";
import { config } from "../environment.config.js";
import logger from "../log/config.js";

// Create a single instance of Mongoose
let dbInstance:Connection;
function createConnection() {
  const mongoURI = `mongodb://${config.db_user}:${config.db_password}@${config.db_host}:${config.db_port}`;


  dbInstance = mongoose.createConnection(mongoURI);

  dbInstance.on("connected", () => {
    console.log("Connected to MongoDB in");
  });

  dbInstance.on("error", (error) => {
    logger.error("Error connecting to MongoDB:", error);
  });
}

export default function getDb() {
  if (!dbInstance) {
    createConnection();
  }
  return dbInstance;
}

// export default getDb