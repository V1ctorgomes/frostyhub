const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CEP_REGEX = /^[0-9]{8}$/;

function isValidEmail(email) {
  if (!email) return true;
  return EMAIL_REGEX.test(email);
}

function isValidCepDigits(cep) {
  return CEP_REGEX.test(cep.replace(/\D/g, ""));
}

function getCustomerValidationErrors(data) {
  const errors = {};

  if (!data.name) errors.name = "Nome é obrigatório.";
  if (!data.cep || !isValidCepDigits(data.cep)) {
    errors.cep = "CEP inválido. Digite 8 números.";
  }
  if (!data.street) errors.street = "Logradouro é obrigatório.";
  if (!data.number) errors.number = "Número é obrigatório.";
  if (!data.neighborhood) errors.neighborhood = "Bairro é obrigatório.";
  if (!data.city) errors.city = "Cidade é obrigatória.";
  if (!data.state) errors.state = "Estado é obrigatório.";
  if (!data.uf) errors.uf = "UF é obrigatória.";
  if (data.email && !isValidEmail(data.email)) {
    errors.email = "E-mail inválido.";
  }

  return errors;
}

function getLoginValidationErrors(email, password) {
  const errors = {};

  if (!email) errors.email = "E-mail é obrigatório.";
  else if (!isValidEmail(email)) errors.email = "E-mail inválido.";

  if (!password) errors.password = "Senha é obrigatória.";

  return errors;
}
