const fp = require("fastify-plugin");

/**
 *   Here lies the territory of middleware 🏴‍☠️
 *
 *   It will handle functionality regarding
 *   - Token Validation, Admin rights, Token decoding
 */
module.exports = fp(async function (app, opts) {

  app.register(require("fastify-jwt"), {
    secret: process.env.SECURE_SESSION_SALT,
  });

  /**
   *   To check if user has passed a valid token
   *
   */
  app.decorate("verifyToken", async function (request, reply) {
    try {
      await app.jwt.verify(request.headers["x-auth-token"]);
    } catch (err) {
      reply.send(err);
    }
  });

  /**
   *  To check if token being passed has admin rights or not ?
   *  We are not going to allow any adda user to login the api with his token
   *
   *  Aren't we 😁
   */
  app.decorate("isAdmin", async function (req, reply) {
    try {
      const { is_admin } = await app.jwt.decode(
        req.headers["x-auth-token"]
      );
      if (is_admin !== "Y") {
        reply
          .code(401)
          .send({
            error: "Unauthorized",
            message: "You do not have rights to access",
          });
      }
    } catch (err) {
      reply.send(err);
    }
  });

  // Lets get the data out of the token by decoding it.
  app.decorate("decodedToken", async function (req) {
    try {
      return await app.jwt.decode(req.headers["x-auth-token"]);
    } catch (err) {
      reply.send(err);
    }
  });

  app.decorate("hasRole", async function (req, reply) {
    try {
      const decodedToken = await app.decodedToken(req);

      if (!("role_id" in decodedToken)) {
        reply
          .code(403)
          .send({
            error: "Forbidden",
            message: "You do not have rights to access",
          });
      }
    } catch (err) {
      reply.send(err);
    }
  });
});
