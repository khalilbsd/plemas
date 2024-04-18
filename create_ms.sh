#!/bin/bash

# Check if a directory name is provided as an argument
if [ $# -eq 0 ]; then
    echo "Usage: $0 <project_name>"
    exit 1
fi

# Create a directory with the project name
 if [ -d "MS_$1" ]; then
        echo "Directory 'Ms_$1' already exists. Aborting."
        exit 1
    fi
mkdir "MS_$1"
cd "MS_$1"


declare -a arr=("controllers"
"services"
"models"
"routes"
"constants"
"db"
"errors"
"i18n"
"mails"
"middleware"
"uploads"
"utils"
)

# Create directories for each microservice
for i in "${arr[@]}"
do

   mkdir "$i"
done
# Copy basic files
cp ../server/db/*  ./db
cp ../server/errors/*  ./errors
cp ../server/middleware/*  ./middleware
cp ../server/Utils/*  ./utils


echo "structure created succussfully"

# Create a basic package.json file in each microservice directory
    cat <<EOF > "./package.json"
{
  "name": "MS_$1 server",
  "version": "1.0.0",
  "type": "module",
  "description": "MS_$1 folder",
  "main": "index.js",
  "scripts": {
    "start": "node index.js --prod",
    "start:dev": "nodemon --config nodemon.json index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/khalilbsd/plemas.git.git"
  },
  "author": "IT Solution",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/khalilbsd/plemas.git/issues"
  },
  "homepage": "https://github.com/khalilbsd/plemas.git#readme",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "jsonwebtoken": "^9.0.2",
    "moment": "^2.29.4",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.5",
    "path": "^0.12.7",
    "url": "^0.11.2",
    "winston": "^3.10.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-config-google": "^0.14.0",
    "nodemon": "^3.0.1",
    "eslint-plugin-security": "^2.1.1"

  }
}
EOF


# Create a basic index.js file in each microservice directory
    cat <<EOF > "./index.js"
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

EOF
echo "created default files for the service $1"

# pwd
echo "installing the default package for the service: $1"

npm i

echo "Node.js microservices template created successfully in directory $1"
