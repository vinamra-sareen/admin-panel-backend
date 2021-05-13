const Admin = require('../../../../../controllers/admin/admin')

/*
 *     All the routes related to Admin, will be available below
 *     We pass the instance of fastify to Admin controller
 *     to be able to connect to database
 */

module.exports = function (app, opts, done) {
  const admin = new Admin(app);

  app.post("/login", {
    handler: admin.login
  })

  app.get("/get_bank_details_report", {
    schema: { query: {}},
    preValidation: [app.verifyToken, app.isAdmin, app.hasRole],
    handler: admin.getBankReport
  });
  
  done();
};