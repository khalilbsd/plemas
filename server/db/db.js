// db.js
import cls from 'cls-hooked';
import { Sequelize } from "sequelize";
import { config } from "../environment.config.js";
import logger from "../log/config.js";
// Initialize Sequelize with your database connection details
//for test purposes use
/**
 const sequelize = new Sequelize('chronos', 'root', '', {
 */
const namespace =cls.createNamespace("chronos-namespace")

Sequelize.useCLS(namespace)
const sequelize = new Sequelize(
  config.db_name,
  config.db_user,
  config.db_password,
  {
    host: "localhost",
    dialect: "mysql",
    logging: (sql, timing) => {
      // You can use your custom logger here

      logger.info(`SQL Query: ${sql}`);
      logger.info(`Execution Time: ${Number(timing)}ms`);
    }
  }
);

// Test the connection
async function connect() {
  try {
    await sequelize.authenticate();
    // console.log('Database connection has been established successfully.');
    logger.debug("db connexion successful !!");
    // return sequelize
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connect();

export default sequelize;
