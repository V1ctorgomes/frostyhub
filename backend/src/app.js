const express = require("express");
const corsMiddleware = require("./middlewares/cors");
const errorMiddleware = require("./middlewares/errorMiddleware");
const routes = require("./routes");

const app = express();

app.use(corsMiddleware());
app.use(express.json());

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
