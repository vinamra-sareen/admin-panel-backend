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
      reply.code(201).send(result);
    } else {
      reply.code(400).send(result);
    }
  });

  // Land to admin page
  instance.get(
    "/admin",
    {
      preValidation: [instance.authenticate],
    },
    async (req, reply) => {
      const decodedToken = instance.decodedToken(req);

      let { role_id, user_id } = decodedToken;
      
      if ("role_id" in decodedToken) {
        const checkIfExists = await userRoleController.findBy({
          user_id,
          user_role_id: role_id,
        });

        let role = null, modules = [];
        let module_ids = [];
        if (checkIfExists != null) {
          role = await roleModulesController.findBy({ role_id });
          // console.log(role);
          module_ids = _.map(role, "module_id");
          
          for(const module_id of module_ids){
            const module = await modulesController.findBy({ module_id });
            if(module.length > 0) {
              modules.push(_.pick(module[0], ['module_name', 'navigation_name', 'module_link', 'parent_link']));
            }
          }
          
          reply.send({modules});
        } else {
          reply.send({ statusCode: 200, data: { module_ids: [] }, message: 'No modules found !' });
        }
      } else {
        reply.send({ statusCode: 200, data: { module_ids: [] }, message: 'No modules found !' });
      }
    }
  );

  done();
};
