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
    if (req.validationError) {
      return req.validationError;
    }
    
    const res = await this.modules.findAll();

    return {
      statusCode: 200,
      data: {
        modules: res,
      },
      message: `Total ${res.length} found.`,
    };
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
    });

    return res;
  };

}

module.exports = ModulesController;
