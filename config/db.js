const fp = require("fastify-plugin");
const Sequelize = require("sequelize");

/**
 * 
 * The core module for initializing databases
 * 
 *  
 */
async function sequelizePlugin(app, opts, done) {
  const {
    MARIADB_NAMES,
    MARIADB_USER,
    MARIADB_PASSWORD,
    MARIADB_HOST,
    MARIADB_DIALECT,
    MARIADB_TIMEZONE,
  } = process.env;

  // Here we get Database names from env files
  let DB_NAMES = JSON.parse(MARIADB_NAMES);
  for(const DB_NAME of DB_NAMES){
    
    let sequelize = app[`db.${DB_NAME}`];
    if (app[`${DB_NAME}IsConnected`] != true) {
      sequelize = new Sequelize(DB_NAME, MARIADB_USER, MARIADB_PASSWORD, {
        host: MARIADB_HOST,
        dialect: MARIADB_DIALECT,
        dialectOptions: {
          timezone: MARIADB_TIMEZONE,
        },
        define: {
          charset: "utf8",
          collate: "utf8_general_ci",
        },
        timezone: MARIADB_TIMEZONE,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        logging: true
      });

      app.decorate(`db.${DB_NAME}`, sequelize);
      app.decorate(`${DB_NAME}IsConnected`, true);
    }

    try {
      await sequelize.authenticate();
      // app.log.info("Connection has been established successfully.");
      console.log(`Connection has been established successfully for ${DB_NAME}`);
    } catch (error) {
      // app.log.error("Unable to connect to the database:", error);
      console.error("Unable to connect to the database:", error);

    }
  }
  
  done();
}

module.exports = fp(sequelizePlugin);
