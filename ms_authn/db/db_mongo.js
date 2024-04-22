// db.js
import mongoose from "mongoose";
import { config } from "../config/environment.config.js";
import logger from "../log/config.js";

// Create a single instance of Mongoose
let dbInstance;
function createConnection() {
  const mongoURI = `mongodb://${config.db_user}:${config.db_password}@${config.db_host}:${config.db_port}`;
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  dbInstance = mongoose.createConnection(mongoURI, connectionOptions);

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