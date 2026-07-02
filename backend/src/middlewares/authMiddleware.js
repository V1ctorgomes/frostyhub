const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token não fornecido.", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    next(new AppError("Token inválido ou expirado.", 401));
  }
}

module.exports = authMiddleware;
