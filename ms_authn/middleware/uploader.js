// multerConfig.js

import multer from "multer";
import { FILE_TYPE_PATH, IMAGE_TYPE_PATH } from "../constants/constants.js";
import fs from "fs";

// Define a function that returns multer middleware with the specified storage
const createMulterMiddleware = (fieldName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir = "./uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      if (fieldName === "profileImage") {
        uploadDir = IMAGE_TYPE_PATH;
        // Check if the IMAGE_TYPE_PATH folder exists, if not, create it
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }
      } else {
        uploadDir = FILE_TYPE_PATH;
        // Check if the FILE_TYPE_PATH folder exists, if not, create it
        if (!fs.existsSync(FILE_TYPE_PATH)) {
          fs.mkdirSync(FILE_TYPE_PATH);
        }
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Generate unique file names
    }
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB in bytes (5 * 1024 * 1024 bytes)
    }
    // }).single(fieldName);
  }).array(fieldName, 10);
};

// Export the createMulterMiddleware function
export default createMulterMiddleware;
