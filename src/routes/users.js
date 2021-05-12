const UserController = require("../controllers/users");
const UserSchema = require("../schemas/users");

/*
 *     All the routes related to user, will be available below
 *     We pass the instance of fastify to User controller
 *     to be able to connect to database
 */

module.exports = function (app, opts, done) {
  const userController = new UserController(app);

  // Route to check if user exist update his/her profile, otherwise create.
  app.post("/", {
    // Used to validate and serialize response and body
    schema: {
      body: UserSchema.createBodyOpts,
      response: UserSchema.createResponseOpts,
    },
    // Handles the operation
    handler: async (req, reply) => {
      const result = await userController.createOrUpdate({...req.body});
      reply.send(result);
    },
  });

  // Route to get all user.
  app.get("/", async (req, reply) => {
    const result = await userController.findAll({...req.query});
    reply.send(result);
  });

  // Route to find user based on conditions.
  app.get("/findBy", {
    // Used to validate and serialize response and body
    schema: {
      params: UserSchema.findByParamsOpts,
    },
    // Handles the operation
    handler: async (req, reply) => {
      const result = await userController.findBy({...req.query});
      reply.send(result);
    },
  });

  // Route to remove user, if exist.
  app.delete("/", {
    schema: {
      body: UserSchema.deleteBodyOpts,
      response: UserSchema.deleteResponseOpts,
    },
    handler: async (req, reply) => {
      const result = userController.delete({...req.body});
      reply.send(result);
    },
  });
  
  done();
};
