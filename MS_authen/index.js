import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "./environment.config.js";
import { globalErrorHandler } from "./Utils/errorHandler.js";
import { handleError } from "./middleware/errors.js";
import exampleRoutes from "./routes/example.route.js";
import testRoutes from "./routes/testExample.route.js";
import passport from "./controllers/auth/passport-config.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
// dotenv.config();
app.use(express.urlencoded({extended: true}));
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
app.use("/api/example", exampleRoutes);
//testing routes
app.use("/api/exmaple/test", testRoutes);

import "./db/relations.js";

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

const PORT = config.port
app.listen(PORT, () => console.log("server running on post : ",PORT));
app.all("*", (req, res, next) => {
  const err = new Error("can't find ",req.originalUrl);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});
app.use(globalErrorHandler);

