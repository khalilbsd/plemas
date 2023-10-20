import logger from "../log/config.js";
import User from "../models/users/User.model.js";
import dotenv from "dotenv";
import ResetPasswordToken from "../models/users/ResetPasswordToken.model.js";
import Project from "../models/project/Project.model.js";

dotenv.config();
const force = process.env.FORCE_DB_SYNC === "true";

logger.debug("------- Preforming DataBase synchronization");

// Define relations here
User.hasOne(UserProfile, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

User.hasMany(ResetPasswordToken, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

User.hasMany(Project, { foreignKey: "manager", as:'managerID'});
User.hasMany(Project, { foreignKey: "createdBy", as :"creatorDetails" });

User.sync({ force: force }).then(() => {
  logger.debug("User model synced with the database");
});

import UserProfile from "../models/users/UserProfile.model.js";

UserProfile.belongsTo(User, {
  foreignKey: "userID"
});

// console.log(User);

UserProfile.sync({ force: force }).then(() => {
  logger.debug("UserProfile model synced with the database");
});

ResetPasswordToken.belongsTo(User, {
  foreignKey: "userID"
});
ResetPasswordToken.sync({ force: force }).then(() => {
  logger.debug("ResetPasswordToken model synced with the database");
});

//references  project
import ProjectLots from "../models/project/ProjectLot.model.js";
import Lot from "../models/project/Lot.model.js.js";
import Phase from "../models/project/Phase.model.js";

Project.belongsToMany(Lot, {
  through: ProjectLots,
  foreignKey: "projectID"
});

Project.belongsTo(User, { foreignKey: "manager", as: "managerID" });
Project.belongsTo(User, { foreignKey: "createdBy", as: "creatorDetails" });



Lot.belongsToMany(Project, { through: ProjectLots, foreignKey: "lotID"});

Project.belongsTo(Phase, { foreignKey: "phaseID" });
Phase.hasMany(Project, { foreignKey: "phaseID" });
// First, synchronize the Lot model
Project.hasOne(Project, { foreignKey: "prevPhase" });
Project.belongsTo(Project, { foreignKey: "prevPhase" });

Project.hasMany(ProjectLots, { foreignKey: "projectID" });
ProjectLots.belongsTo(Project, { foreignKey: "projectID" });
Lot.hasMany(ProjectLots, {
  foreignKey: "lotID",
});
ProjectLots.belongsTo(Lot, {
  foreignKey: "lotID",

});

Lot.sync({ force: force }).then(() => {
  logger.debug("Lot model synced with the database");
});

// Then, synchronize the Project model
Project.sync({ force: force }).then(() => {
  logger.debug("Project model synced with the database");
});

// Then, synchronize the Phase model
Phase.sync({ force: force }).then(() => {
  logger.debug("Phase model synced with the database");
});

// Finally, synchronize the ProjectLots model
ProjectLots.sync({ force: force }).then(() => {
  logger.debug("ProjectLot model synced with the database");
});

export { User, UserProfile, Lot, Project, ProjectLots, Phase };
