require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3001;

function validateEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const required = ["DATABASE_URL", "FRONTEND_URL", "JWT_SECRET"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Variáveis de ambiente obrigatórias ausentes: ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

validateEnv();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
