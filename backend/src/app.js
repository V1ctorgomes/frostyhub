const express = require("express");
const errorMiddleware = require("./middlewares/errorMiddleware");
const routes = require("./routes");

const app = express();

app.use(require("./middlewares/cors"));
app.use(express.json());

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
