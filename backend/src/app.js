const express = require("express");
const corsMiddleware = require("./middlewares/cors");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();

app.use(corsMiddleware());
app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
