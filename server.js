// Get configuration
const fastify = require("fastify");
require("make-promises-safe");

require("dotenv").config({
  path: `./config/.env.${process.env.NODE_ENV ? process.env.NODE_ENV : "stirling"}`,
});

// Create an instance of fastify
const app = fastify({ ignoreTrailingSlash: true, logger: {
    // file: './debug.log',
    prettyPrint: true,
} });

// Enabled Cors Policy, for annoying unknown create errors
app.register(require('fastify-cors'), {
    origin: true,
    methods: 'GET,PUT,POST,DELETE',
    allowHeaders: 'Content-Type'
  }
);

// Redis for super fast data fetch. Isn't it  mind blowing 🤯
// app.register(require('fastify-redis'), { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })

// Load Jwt based Authentication Middleware 
app.register(require('./src/middleware/auth'));

// Register Database with fastify
app.register(require("./config/db.js")).ready();

// Register routes
app.register(require("./src/routes/index"), { prefix: "/api/v1/" });
app.register(require("./src/routes/users"), { prefix: "/api/v1/users" });
app.register(require("./src/routes/auth"), { prefix: "/api/v1/auth" });
app.register(require('./src/routes/admin'), { prefix: '/api/v1/admin' })

// Initialize the server
const PORT = process.env.PORT_SERVER || 8000;

const start = async () => {
  await app.listen(PORT, '0.0.0.0');
//   app.log.info(`Server listening on ${PORT}`);
  console.log(`Server listening on ${PORT}`);
};

start();