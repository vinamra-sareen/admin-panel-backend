const Index = require('../../../../controllers/')

/*
 *     All the routes related to Admin, will be available below
 *     We pass the instance of fastify to Admin controller
 *     to be able to connect to database
 */

module.exports = function (app, opts, done) {
  const index = new Index(app);

  app.post("/login", {
    handler: index.login
  })

  app.get("/get_modules", {
    schema: { query: {}},
    preValidation: [app.verifyToken, app.isAdmin, app.hasRole],
    handler: index.getModules
  });
  
  done();
};

// module.exports.prefixOverride = '/admin'