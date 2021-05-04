const {modulesCondition} = require("../utilities/search");

/**
 *      ModulesController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class ModulesController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.modules = require("../models/modules")(fastify[`db.${STAGE}cardplay`]);
    // const self = this;
    // (async function () {
    //   await self.user.sync({ alter: true });
    // })();
  }

  /**
   *
   *  Get All modules
   *
   *
   * @param {*} req
   * @param {*} reply
   *
   */

  findAll = async (req) => {
    // if (req.validationError) {
    //   return req.validationError;
    // }
    
    const modules = await this.modules.findAll();

    return modules;
  };

  /**
   *
   *  Find by module
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

    const res = await this.modules.findAll({
      where: modulesCondition(req),
      order:[['navigation_name', 'ASC']]
    });

    return res;
  };

}

module.exports = ModulesController;
