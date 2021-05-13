const User = require('../../../../../controllers/admin/user')

/*
 *     All the routes related to Admin, will be available below
 *     We pass the instance of fastify to Admin controller
 *     to be able to connect to database
 */

module.exports = function (app, opts, done) {
  const user = new User(app);

  // Route to find based on conditions.
  app.get("/user_document_list", {
    preValidation: [app.verifyToken, app.isAdmin, app.hasRole],
    handler: user.getUserDocumentList,
  });
  
  done();
};