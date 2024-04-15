import logger from "../../log/config.js";

export const changeUserDate = async (userData, user) => {
  try {
    delete userData.email;
    delete userData.password;
    delete userData.role;
    const keys = Object.keys(userData);

    for (const idx in keys) {
      user[keys[idx]] = userData[keys[idx]];
    }

    await user.save();
    return user;
  } catch (err) {
    logger.error(`error updating the user because ${err}`);
    return null;
  }
};
