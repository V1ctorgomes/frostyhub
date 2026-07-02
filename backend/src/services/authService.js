const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { userQueries, query } = require("../database/queries");

async function login(email, password) {
  const result = await query(userQueries.findByEmail, [email]);

  if (result.rows.length === 0) {
    throw new AppError("Email ou senha inválidos.", 401);
  }

  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError("Email ou senha inválidos.", 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

module.exports = { login };
