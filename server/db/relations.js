import logger from "../log/config.js";
import Project from "../models/project/Project.model.js";
import ResetPasswordToken from "../models/users/ResetPasswordToken.model.js";
import User from "../models/users/User.model.js";
import Intervenant from "../models/tasks/Intervenant.model.js"
const force = config.force_db_sync === "true";

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

// User.hasMany(Project, { foreignKey: "manager", as: "managerID" });
// User.hasMany(Project, { foreignKey: "createdBy", as: "creatorDetails" });

// //intervenant

// User.belongsToMany(Project, {
//   through: Intervenant,
//   foreignKey: "intervenantID",
//   as: "intervenant"
// });

// User model associations
User.hasMany(Project, { foreignKey: "manager", as: "managedProjects" });
User.hasMany(Project, { foreignKey: "createdBy", as: "createdProjects" });
// Intervenant model association
User.belongsToMany(Project, {
  through: Intervenant,
  foreignKey: "intervenantID",
  as: "intervenantProjects"
});
User.hasMany(Intervenant,{foreignKey: "intervenantID",})
Intervenant.belongsTo(User,{foreignKey: "intervenantID",});



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
import { config } from "../environment.config.js";
import Lot from "../models/project/Lot.model.js.js";
import Phase from "../models/project/Phase.model.js";
import ProjectLots from "../models/project/ProjectLot.model.js";

Project.belongsToMany(Lot, {
  through: ProjectLots,
  foreignKey: "projectID"
});

// Project.belongsTo(User, { foreignKey: "manager", as: "managerID" });
// Project.belongsTo(User, { foreignKey: "createdBy", as: "creatorDetails" });
// /* intervenant  */
// Project.belongsToMany(User,{through:Intervenant,foreignKey:"projectID",as:"intervention"})

// Project model associations
Project.belongsTo(User, { foreignKey: "manager", as: "managerDetails" });
Project.belongsTo(User, { foreignKey: "createdBy", as: "creatorDetails" });

Project.belongsToMany(User, {
  through: Intervenant,
  foreignKey: "projectID",
  as: "intervenants"
});


Project.hasMany(Intervenant,{foreignKey: "projectID"})
Intervenant.belongsTo(Project,{foreignKey: "projectID",})


Lot.belongsToMany(Project, { through: ProjectLots, foreignKey: "lotID" });

Project.belongsTo(Phase, { foreignKey: "phaseID" });
Phase.hasMany(Project, { foreignKey: "phaseID" });
// First, synchronize the Lot model
Project.hasOne(Project, { foreignKey: "prevPhase" });
Project.belongsTo(Project, { foreignKey: "prevPhase" });

Project.hasMany(ProjectLots, { foreignKey: "projectID" });
ProjectLots.belongsTo(Project, { foreignKey: "projectID" });
Lot.hasMany(ProjectLots, {
  foreignKey: "lotID"
});
ProjectLots.belongsTo(Lot, {
  foreignKey: "lotID"
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

// then, synchronize the ProjectLots model
ProjectLots.sync({ force: force }).then(() => {
  logger.debug("ProjectLot model synced with the database");
});
// Finally, synchronize the Intervenant model
Intervenant.sync({ force: force }).then(() => {
  logger.debug("Intervenant model synced with the database");
});



export { Lot, Phase, Project, ProjectLots, User, UserProfile };
