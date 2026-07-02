const AppError = require("../utils/AppError");

const CUSTOMER_REQUIRED_FIELDS = [
  "name",
  "cep",
  "street",
  "neighborhood",
  "city",
  "state",
  "uf",
  "number",
];

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email e senha são obrigatórios.", 400));
  }

  next();
}

function validateCustomer(req, res, next) {
  const missingFields = CUSTOMER_REQUIRED_FIELDS.filter(
    (field) => !req.body[field] || String(req.body[field]).trim() === ""
  );

  if (missingFields.length > 0) {
    return next(
      new AppError(
        `Campos obrigatórios não preenchidos: ${missingFields.join(", ")}.`,
        400
      )
    );
  }

  next();
}

module.exports = { validateLogin, validateCustomer };
