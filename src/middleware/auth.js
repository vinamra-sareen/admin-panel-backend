const fp = require("fastify-plugin")

/**
 *   Here lies the territory of middleware 🏴‍☠️
 * 
 *   It will handle functionality regarding
 *   - Token Validation, Admin rights, Token decoding  
 */
module.exports = fp(async function(fastify, opts) {
  fastify.register(require("fastify-jwt"), {
    secret: process.env.SECURE_SESSION_SALT
  })

  /**
   *   To check if user has passed a valid token
   * 
   */
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      await fastify.jwt.verify(request.headers['x-auth-token'])
    } catch (err) {
      reply.send(err)
    }
  })
  
  /**
   *  To check if token being passed has admin rights or not ?
   *  We are not going to allow any adda user to login the api with his token
   * 
   *  Aren't we 😁
   */
  fastify.decorate("isAdmin", async function(req, reply) {
    try {
      const { is_admin } = await fastify.jwt.decode(req.headers["x-auth-token"]);
      if(is_admin !== "Y") {
        reply.code(401).send({ error: "Unauthorized", message: "You do not have rights to access !"});
      }
    } catch(err) {
      reply.send(err);
    }
  })

  // Lets get the data out of the token by decoding it. 
  fastify.decorate("decodedToken", async function(req) {
    try {
      return await fastify.jwt.decode(req.headers["x-auth-token"])
    } catch(err) {
      reply.send(err);
    }
  })

})