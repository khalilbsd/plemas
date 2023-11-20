import moment from "moment";
import {
  action_codes,
  action_phrases,
  actions_list
} from "../constants/constants.js";
import logger from "../log/config.js";
import fs from "fs/promises";
import readline from "readline";
import { createReadStream } from "fs";
export const takeNote = async (
  actionName,
  email,
  projectID,
  { taskID = null, requestID = null }
) => {
  if (!actions_list.includes(actionName)) {
    logger.error("action name unknown");
    return null;
  }
  if (!email) {
    logger.error(`the user email was not provided: value ${email}`);
    return null;
  }
  const code = action_codes.find((line) => line.action === actionName)?.code;
  if (!code) {
    logger.error(
      `code is unknown                                                                                       `
    );
    return null;
  }

  try {
    let note = {
      projectID,
      taskID,
      requestID,
      email: email,
      action: actionName,
      code,
      action_date: moment().format("DD/MM/YYYY")
    };
    const existingContent = await fs.readFile(
      "../server/tracking/tracking.txt",
      "utf-8"
    );

    // Append the new note and a newline character
    const updatedContent = existingContent + JSON.stringify(note) + "\n";

    // Write the updated content back to the file
    await fs.writeFile("../server/tracking/tracking.txt", updatedContent);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const getTracking = async (projectID) => {
  try {
    const fileStream = createReadStream("../server/tracking/tracking.txt");

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    let projectTracking = [];
    for await (const line of rl) {
      const data = JSON.parse(line);
      if (data.projectID !== parseInt(projectID)) continue;
      const text = action_phrases[data.code](data);
      projectTracking.push({
        date :data.action_date,
        text

      });
    }

    return projectTracking;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
