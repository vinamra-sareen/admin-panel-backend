const {userRoleCondition} = require("../utilities/search");

/**
 *      UserRoleController -
 *
 *      All the CRUD operations are handled here only
 *      Only functions are available through which
 *      we will create interfaces
 *
 */
class UserRoleController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(fastify) {
    let { STAGE } = process.env;
    this.user_role = require("../models/user_role")(fastify[`db.${STAGE}cardplay`]);
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
    
    const res = await this.user_role.findAll();

    return {
      statusCode: 200,
      data: {
        user_role: res,
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

    const [role, created] = await this.user_role.findAll({
      where: userRoleCondition(req),
    });

    return role;
  };

}

module.exports = UserRoleController;
