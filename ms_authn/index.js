import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import passport from "./config/passport-config.js";
import getDb from "./db/db_mongo.js";
import { config } from "./config/environment.config.js";
import logger from "./log/config.js";
import { handleError } from "./middleware/errors.js";
import { globalErrorHandler } from "./utils/errorHandler.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import mongoose from "mongoose";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(handleError);
app.use(express.json());
app.use(passport.initialize());
//static routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDirectory = path.join(__dirname, "uploads");
// Serve uploaded files as static assets
app.use("/uploads", express.static(uploadsDirectory));
// api routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
//testing routes
// app.use("/api/exmaple/test", testRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,authorization,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const PORT = config.port;
const mongoURI = `mongodb://${config.db_user}:${config.db_password}@${config.db_host}:${config.db_port}`;
console.log(mongoURI);
mongoose
  .connect(mongoURI)
  .then(
    () =>
      // console.log("db connexion successful !!"),
      logger.info("db connexion successful !!"),
      app.listen(PORT, () => logger.info("server running on port : " + PORT))
  )
  .catch((error) => console.log(error.message));


app.all("*", (req, res, next) => {
  const err = new Error("can't find ", req.originalUrl);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});
app.use(globalErrorHandler);
