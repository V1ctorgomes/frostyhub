const cors = require("cors");

function corsMiddleware() {
  const origin = process.env.FRONTEND_URL || "http://localhost:3000";

  return cors({
    origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}

module.exports = corsMiddleware;
