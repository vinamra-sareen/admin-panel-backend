const {
  modulesCondition,
  roleModulesCondition,
} = require("../utilities/");
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
    // Get role_id from the token received by client.
    const { role_id } = await this.app.decodedToken(req);

    /* 
    *   If role id does not equates to 1, first check if  
    *   Is this request for a submodule, or list of all parent_modules
    *   Then get a list of all module_ids based on condition formed.
    *   
    *   Then get all the modules, by status -> 1, module_ids (by condidtion) and
    *   parent_module_id -> 0 (for no condition) or req.query.module_id (for submodule request)
    *    
    */ 
    if (role_id != 1) {
      let condition = {};
      // Check to see if there is a request for submodule.
      if (Object.keys(req.query).length > 0) {
        condition = _.omit(req.query, ["module_id"]);
      }

      condition.role_id = role_id;
      let mCondition = null;

      // Get all module_id based on or not on condition
      const role_modules = await this.role_modules.findAll({
        where: roleModulesCondition(condition),
        attributes: ["module_id"],
      });

      // Get list of all the module_ids
      let module_ids = _.map(role_modules, "module_id");

      // Prepare a condition object.
      mCondition = {
        parent_link: "",
        status: 1,
        module_id: module_ids,
        parent_module_id: req.query.module_id ? req.query.module_id : 0,
      };

      // Fetch all 
      const modules = await this.modules.findAll({
        where: modulesCondition(mCondition),
        order: [["navigation_name", "ASC"]],
        attributes: ["navigation_name", "module_link", "module_id"],
      });

      reply.code(200).send({ modules });
    } else {
      /*
      *    If role_id is 1, get all parent_modules with id -> 0
      *    and module_id, navigation_name and module_link only.   
      */
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
