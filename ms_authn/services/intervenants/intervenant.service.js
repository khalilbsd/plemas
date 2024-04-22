export const projectPotentialIntervenants = async (projectID) => {
    const objectQuery = {
      isBanned: false,
      role: { [Op.ne]: CLIENT_ROLE }
    };
    const existingIntervenants = await Intervenant.findAll({
      where: { projectID: projectID, intervenantID: { [Op.not]: null } },
      attributes: ["intervenantID"]
    });

    if (existingIntervenants) {
      let list = [];
      existingIntervenants.forEach((inter) => {
        list.push(inter.intervenantID);
      });
      objectQuery.id = {
        [Op.notIn]: list
      };
    }

    const users = await User.findAll({
      where: objectQuery,
      attributes: ["id", "email"],
      include: [
        {
          model: UserProfile,
          attributes: ["name", "lastName", "image", "poste"]
        }
      ]
    });
    const simplifiedUsers = users.map((user) => {
      const { id, email } = user.toJSON();
      const userProfile = user.UserProfile ? user.UserProfile.toJSON() : null;
      const { name, lastName, image, poste } = userProfile || "";
      return {
        id,
        email,
        lastName,
        name,
        image,
        poste
      };
    });

    return simplifiedUsers;
  };

