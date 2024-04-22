import User from "../../models/users/User.model";

export const getUserByEmail = async (
    email:string,
    includeProfile = true,
    withBanned = false
  ) => {
    if (!email) return null;
    const queryOptions = { email: email, isBanned: withBanned };
    let user;
    if (includeProfile) {
      user = await User.findOne(queryOptions).populate("profile").exec();
    } else {
      user = await User.findOne(queryOptions).exec();
    }
    if (user) return user;

    return null;
  };