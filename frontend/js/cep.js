const VIA_CEP_URL = "https://viacep.com.br/ws";

let cepSearchInProgress = false;
let lastSearchedCep = "";

function mapViaCepResponse(data) {
  return {
    street: (data.logradouro || "").trim(),
    neighborhood: (data.bairro || "").trim(),
    city: (data.localidade || "").trim(),
    state: (data.estado || "").trim(),
    uf: (data.uf || "").trim().toUpperCase(),
  };
}

async function fetchAddressByCep(cep) {
  const cleaned = cep.replace(/\D/g, "");

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

function fillAddressFields(address) {
  const fields = ["street", "neighborhood", "city", "state", "uf"];

  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (!input) return;
    input.value = address[field];
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  const numberField = document.getElementById("number");
  if (numberField && !numberField.value) {
    numberField.focus();
  }
}

async function searchCep() {
  const cepInput = document.getElementById("cep");
  if (!cepInput) return;

  const cleaned = cepInput.value.replace(/\D/g, "");

  if (!cleaned) return;

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

  cepInput.addEventListener("input", () => {
    const digits = cepInput.value.replace(/\D/g, "").slice(0, 8);
    cepInput.value = formatCep(digits);

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
