const _ = require("lodash");
const { indexOpts } = require("../schemas/index");
const UserController = require("../controllers/users");
const UserRoleController = require("../controllers/user_role");

module.exports = function (app, opts, done) {
  const userController = new UserController(app);
  const userRoleController = new UserRoleController(app);

  // Home Page
  app.get("/", indexOpts, async (req, reply) => {
    reply.send({ message: "ping pong !" });
  });

  // Login route
  app.post("/login", {}, async (req, reply) => {
    const result = await userController.login({ ...req.body });
    const role = await userRoleController.findBy(result);

    if (role != null) {
      const { user_role_id: role_id } = role;
      result.role_id = role_id;
    }

    if (result.statusCode == 200) {
      const token = app.jwt.sign(result);
      reply.code(200).send({ ...result, token });
    } else if (result.statusCode === 201) {
      reply.code(201).send({
        ...result,
        message: "Invalid Credentials, please check again.",
      });
    } else {
      reply.code(400).send(result);
    }
  });

  done();
};
