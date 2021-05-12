const Admin = require('../controllers/admin/admin')

/*
 *     All the routes related to Admin, will be available below
 *     We pass the instance of fastify to Admin controller
 *     to be able to connect to database
 */

module.exports = function (app, opts, done) {
  const admin = new Admin(app);

  // Route to find based on conditions.
  app.get("/user_document_list", {
    preValidation: [app.verifyToken, app.isAdmin, app.hasRole],
    handler: admin.getUserDocumentList,
  });


  app.get("/get_bank_details_report", {
    schema: { query: {}},
    preValidation: [app.verifyToken, app.isAdmin, app.hasRole],
    handler: admin.getBankReport
  });

  app.get("/get_modules", {
    schema: { query: {}},
    preValidation: [app.verifyToken, app.isAdmin, app.hasRole],
    handler: admin.getModules
  });
  
  done();
};
