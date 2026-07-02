const { errorResponse } = require("../utils/response");

function errorMiddleware(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500
      ? "Erro interno do servidor."
      : err.message || "Erro interno do servidor.";

  res.status(status).json(errorResponse(message));
}

module.exports = errorMiddleware;
