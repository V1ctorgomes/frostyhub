const cors = require("cors");

const origin = process.env.FRONTEND_URL || "http://localhost:3000";

module.exports = cors({
  origin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
