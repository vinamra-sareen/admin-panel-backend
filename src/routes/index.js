const _ = require("lodash");
const { indexOpts } = require("../schemas/index");
const UserController = require("../controllers/users");
const UserRoleController = require("../controllers/user_role");
const RoleModulesController = require("../controllers/role_modules");
const ModulesController = require("../controllers/modules");

module.exports = function (instance, opts, done) {
  const userController = new UserController(instance);
  const userRoleController = new UserRoleController(instance);
  const roleModulesController = new RoleModulesController(instance);
  const modulesController = new ModulesController(instance);
  

  // Home Page
  instance.get("/", indexOpts, async (req, reply) => {
    reply.send({ message: "ping pong !" });
  });


  // Login route
  instance.post("/login", {}, async (req, reply) => {
    const result = await userController.login({ ...req.body });
    const role = await userRoleController.findBy(result);
    
    if (role != null) {
      const { user_role_id: role_id } = role;
      result.role_id = role_id;
    }

    if (result.statusCode == 200) {
      const token = instance.jwt.sign(result);
      reply.code(200).send({ ...result, token });
    } else if (result.statusCode === 201) {
          reply.code(201).send({...result, message: "Invalid Credentials, please check again."});
    } else {
      reply.code(400).send(result);
    }
  });

  // Land to admin page
  instance.get(
    "/get_modules",
    {
      preValidation: [instance.authenticate, instance.isAdmin],
    },
    async (req, reply) => {
      const decodedToken = await instance.decodedToken(req);

      let { role_id, user_id } = decodedToken;
      
      // if ("role_id" in decodedToken) {
      //   const checkIfExists = await userRoleController.findBy({
      //     user_id,
      //     user_role_id: role_id,
      //   });
        const {module_id = null} = req.query;
      
        let roles = null, modules = [];
        let module_ids = [];
        // if (checkIfExists != null) {
          if(role_id != 1){
            roles = await roleModulesController.findBy({ role_id });
            module_ids = _.map(roles, "module_id");

            for(const module_id of module_ids){
              const module = await modulesController.findBy({ module_id });
              if(module.length > 0) {
                modules.push(_.pick(module[0], ['module_name', 'navigation_name', 'module_link', 'parent_link', 'parent_module_id']));
              }
            }
            
            modules = _.chain(modules).groupBy("parent_link").map((value, key) => ({ parent_link: key, module: value })).value()
            reply.send({modules});
          } else {
            let status = 1, parent_module_id = 0;

            parent_module_id = module_id != null ? module_id : 0;

            modules = await modulesController.findBy({status, parent_module_id });
          
            modules = _.map(modules, _.partialRight(_.pick, ['module_id', 'module_link', 'navigation_name']));
            reply.send({ modules });  
          }
        // } else {
        //   reply.code(200).send([]);
        // }
      // } else {
      //   reply.code(200).send([]);
      // }
    }
  );

  done();
};
