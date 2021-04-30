const RoleModulesController = require("../controllers/role_modules");
const UserRoleController = require("../controllers/user_role");
const ModulesController = require("../controllers/modules");

module.exports = function (instance, opts, done) {
  const userRoleController = new UserRoleController(instance);
  const roleModulesController = new RoleModulesController(instance);
  const modulesController = new ModulesController(instance);

  instance.get("/verify", {
    schema: {},
    preHandler: async (req, reply, done) => {
      console.log('token: ', req.headers.token);
      //   Verify token
      const res = instance.jwt.verify();
      console.log(res);
      done();
    },
    handler: async (req, reply) => {
      reply.send({ message: "Welcome to dashboard" });
    },
  });

  done();
};
