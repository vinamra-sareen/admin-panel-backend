const {
  modulesCondition,
  roleModulesCondition,
} = require("../utilities/search");
const _ = require("lodash");

/**
 *      AdminController -
 *
 *      The admin functions such as
 *      - getModules
 *      - login
 *      - getBankReport will go here
 *
 */
class IndexController {
  // Takes instance of fastify/app, needed to connect to database
  constructor(app) {
    this.app = app;
    let { STAGE } = process.env;
    let cardplay = app[`db.${STAGE}cardplay`];
    this.modules = require("../models/modules")(cardplay);
    this.user = require("../models/users")(cardplay);
    this.role_modules = require("../models/role_modules")(cardplay);
  }

  // Login route
  login = async (req, reply) => {
    const result = await this.user.login(req.body);
    if (result.status === "success") {
      const token = this.app.jwt.sign(result);
      reply
        .code(200)
        .send({ ..._.omit(result, ["user_id", "role_id"]), token });
    } else {
      reply.code(200).send(result);
    }
  };

  getModules = async (req, reply) => {
    const { role_id } = await this.app.decodedToken(req);

    if (role_id != 1) {
      let condition = {};
      if (Object.keys(req.query).length > 0) {
        condition = _.omit(req.query, ["module_id"]);
      }

      condition.role_id = role_id;
      let mCondition = null;

      const role_modules = await this.role_modules.findAll({
        where: roleModulesCondition(condition),
        attributes: ["module_id"],
      });

      let module_ids = _.map(role_modules, "module_id");

      mCondition = {
        parent_link: "",
        status: 1,
        module_id: module_ids,
        parent_module_id: req.query.module_id ? req.query.module_id : 0,
      };

      const modules = await this.modules.findAll({
        where: modulesCondition(mCondition),
        order: [["navigation_name", "ASC"]],
        attributes: ["navigation_name", "module_link", "module_id"],
      });

      reply.code(200).send({ modules });
    } else {
      let condition = null;
      condition = {
        status: 1,
        parent_module_id: req.query.module_id ? req.query.module_id : 0,
      };

      const modules = await this.modules.findAll({
        where: modulesCondition(condition),
        order: [["navigation_name", "asc"]],
        attributes: ["module_id", "navigation_name", "module_link"],
      });

      reply.code(200).send({ modules });
    }
  };
}

module.exports = IndexController;
