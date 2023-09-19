// db.js
import { Sequelize } from 'sequelize';
import logger from '../log/config.js';

// Initialize Sequelize with your database connection details
const sequelize = new Sequelize('chronos', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: (sql, timing) => {
    // You can use your custom logger here

    logger.info(`SQL Query: ${sql}`);
     logger.info(`Execution Time: ${Number(timing)}ms`);
  },
});

// Test the connection
async function connect() {
  try {
    await sequelize.authenticate();
    // console.log('Database connection has been established successfully.');
    logger.debug("db connexion successful !!")
    // return sequelize
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


connect()

export default sequelize;
