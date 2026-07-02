const VIA_CEP_URL = "https://viacep.com.br/ws";

const UF_NAMES = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

const FIELD_MAP = {
  street: "street",
  neighborhood: "neighborhood",
  city: "city",
  state: "state",
  uf: "uf",
};

let cepSearchInProgress = false;
let lastSearchedCep = "";

function cleanCep(cep) {
  return cep.replace(/\D/g, "");
}

function sanitize(value) {
  return String(value || "").trim();
}

function mapViaCepResponse(data) {
  const uf = sanitize(data.uf).toUpperCase();

  return {
    street: sanitize(data.logradouro),
    neighborhood: sanitize(data.bairro),
    city: sanitize(data.localidade),
    state: sanitize(data.estado) || UF_NAMES[uf] || uf,
    uf,
  };
}

async function fetchAddressByCep(cep) {
  const cleaned = cleanCep(cep);

  if (!isValidCepDigits(cleaned)) {
    throw new Error("CEP inválido. Digite 8 números.");
  }

  let response;

  try {
    response = await fetch(`${VIA_CEP_URL}/${cleaned}/json/`);
  } catch {
    throw new Error("Erro ao buscar CEP. Tente novamente.");
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar CEP. Tente novamente.");
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Erro ao buscar CEP. Tente novamente.");
  }

  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return mapViaCepResponse(data);
}

function setCepLoading(isLoading) {
  const loader = document.getElementById("cep-loader");
  const searchBtn = document.getElementById("cep-search-btn");
  const cepInput = document.getElementById("cep");

  if (loader) loader.hidden = !isLoading;
  if (searchBtn) searchBtn.disabled = isLoading;
  if (cepInput) cepInput.disabled = isLoading;
}

function setFieldValue(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.classList.add("field--autofilled");

  field.addEventListener(
    "input",
    () => field.classList.remove("field--autofilled"),
    { once: true }
  );
}

function fillAddressFields(address) {
  setFieldValue(FIELD_MAP.street, address.street);
  setFieldValue(FIELD_MAP.neighborhood, address.neighborhood);
  setFieldValue(FIELD_MAP.city, address.city);
  setFieldValue(FIELD_MAP.state, address.state);
  setFieldValue(FIELD_MAP.uf, address.uf);

  const numberField = document.getElementById("number");
  if (numberField && !numberField.value) {
    numberField.focus();
  }
}

async function searchCep() {
  const cepInput = document.getElementById("cep");
  if (!cepInput) return;

  const cleaned = cleanCep(cepInput.value);

  if (cleaned.length === 0) return;

  if (!isValidCepDigits(cleaned)) {
    showToast("CEP inválido. Digite 8 números.", "warning");
    return;
  }

  if (cepSearchInProgress || lastSearchedCep === cleaned) return;

  cepSearchInProgress = true;
  lastSearchedCep = cleaned;
  setCepLoading(true);

  try {
    const address = await fetchAddressByCep(cepInput.value);

  fillAddressFields(address);
  updateCustomerFormState?.();
  showToast("Endereço preenchido automaticamente.");
  } catch (error) {
    lastSearchedCep = "";
    showToast(error.message, "error");
  } finally {
    setCepLoading(false);
    cepSearchInProgress = false;
  }
}

function initCepField() {
  const cepInput = document.getElementById("cep");
  const searchBtn = document.getElementById("cep-search-btn");

  if (!cepInput) return;

  let isFormattingCep = false;

  cepInput.addEventListener("input", () => {
    if (isFormattingCep) return;

    isFormattingCep = true;
    const digits = cleanCep(cepInput.value).slice(0, 8);
    cepInput.value = formatCep(digits);
    isFormattingCep = false;

    if (digits.length < 8) {
      lastSearchedCep = "";
    }

    if (digits.length === 8) {
      searchCep();
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      lastSearchedCep = "";
      searchCep();
    });
  }
}
