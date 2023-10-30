import { readFileSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../log/config.js";

const currentFilePath = fileURLToPath(import.meta.url);

const currentDirectory = path.dirname(currentFilePath);

export const getRSAPrivateKey = async () => {
  try {
    const encryptFolderPath = path.join(
      currentDirectory,
      "..",
      "..",
      ".encrypt"
    );

    const privateKeyPath = path.join(encryptFolderPath, "secret_key.pem");

    const key = readFileSync(privateKeyPath, "utf8");
    return key;
  } catch (error) {
    logger.error(error);
  }
};
export const getRSAPublicKey = async () => {
  try {
    const encryptFolderPath = path.join(currentDirectory, "..", ".encrypt");
    const publicKeyPath = path.join(encryptFolderPath, "public_key.pem");

    const key = readFileSync(publicKeyPath, "utf8");

    return key;
  } catch (error) {
    logger.error(error);
  }
};
