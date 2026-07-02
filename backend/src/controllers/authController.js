const authService = require("../services/authService");

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
