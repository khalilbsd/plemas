import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import passport from "./controllers/auth/passport-config";
import getDb from "./db/db_mongo";
import { config } from "./environment.config";
import logger from "./log/config";
import { handleError } from "./middleware/errors";
import ErrorPlemas from "./utils/Error";
import { globalErrorHandler } from "./utils/errorHandler";
// import exampleRoutes from "./routes/example.route";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(handleError);
app.use(express.json());
app.use(passport.initialize());
//static routes
// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);
const uploadsDirectory = path.join(__dirname, "uploads");
// Serve uploaded files as static assets
app.use("/uploads", express.static(uploadsDirectory));
// api routes
// app.use("/api/example", exampleRoutes);
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
  // res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const PORT = config.port;
getDb();
app.listen(PORT, () => logger.info("server running on port : " + PORT));
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorPlemas(`can't find ${req.originalUrl}`);
  err.code = 404;
  next(err);
});
app.use(globalErrorHandler);
