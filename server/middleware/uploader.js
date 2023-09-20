// multerConfig.js

import multer from "multer";
import { FILE_TYPE_PATH, IMAGE_TYPE_PATH } from "../constants/uploadTypes.js";
// Define a function that returns multer middleware with the specified storage
const createMulterMiddleware = (fieldName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir = "../uploads";

      // Determine the upload directory based on the fieldName parameter
      if (fieldName === "profileImage") {
        uploadDir = IMAGE_TYPE_PATH;
      } else if (fieldName === "pdf") {
        uploadDir = FILE_TYPE_PATH;
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Generate unique file names
    }
  });

  return multer({ storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB in bytes (5 * 1024 * 1024 bytes)
    },
  }).single(fieldName);
};

// Export the createMulterMiddleware function
export default createMulterMiddleware;
