const _ = require("lodash");
const { indexOpts } = require("../schemas/index");

module.exports = function (app, opts, done) {

  // Home Page
  app.get("/", indexOpts, async (req, reply) => {
    reply.send({ message: "ping pong !" });
  });

  done();
};
