const { AdminCompliance } = require("../../../../../controllers/admin");

/*
 *     All the routes related to Admin, will be available below
 *     We pass the instance of fastify to Admin controller
 *     to be able to connect to database
 */

module.exports = function (app, opts, done) {
  const adminCompliance = new AdminCompliance(app);

  app.get("/get_bank_details_report", {
    schema: { query: {} },
    preValidation: [app.verifyToken, app.isAdmin, app.hasRole],
    handler: adminCompliance.getBankReport,
  });

  done();
};
