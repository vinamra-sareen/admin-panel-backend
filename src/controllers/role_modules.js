const {roleModulesCondition} = require("../utilities/search");

/**
 *      RoleModulesController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class RoleModulesController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.role_modules = require("../models/role_modules")(fastify[`db.${STAGE}cardplay`]);
    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  /**
   *
   *  Get All role modules
   *
   *
   * @param {*} req
   * @param {*} reply
   *
   */

  findAll = async (req) => {
    if (req.validationError) {
      return req.validationError;
    }
    
    const res = await this.role_modules.findAll();

    return {
      statusCode: 200,
      data: {
        role_modules: res,
      },
      message: `Total ${res.length} found.`,
    };
  };

  /**
   *
   *  Find by role modules
   *
   *
   * @param {*} req
   * @param {*} reply
   *
   */
  findBy = async (req) => {
    if (req.validationError) {
      return req.validationError;
    }

    const role_modules = await this.role_modules.findAll({
      where: roleModulesCondition(req),
    });

    return role_modules;
  };

}

module.exports = RoleModulesController;
