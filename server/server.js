import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleError } from "./middleware/errors.js";
import { globalErrorHandler } from "./Utils/errorHandler.js";
import sequelize from "./db.js";
import bodyParser from "body-parser";
import morgan from "morgan";
//session
import session from "express-session";
// routes
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
// import passport from "passport";
import User from "./models/users/User.model.js";
import csrf from 'csrf'
// import { authUser } from "./controllers/auth/authentication.js";
import passport from "./controllers/auth/passport-config.js";


const app = express();
dotenv.config();


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan('dev'))
app.use(handleError);
app.use(express.json());



//session configuration


app.use(passport.initialize())
// // app.use(passport.authenticate())
// app.use(new LocalStrategy(authUser))



// api routes
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)


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


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on post : ${PORT}`));
app.all("*", (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);

