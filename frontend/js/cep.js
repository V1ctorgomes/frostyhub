const VIA_CEP_URL = "https://viacep.com.br/ws";

function cleanCep(cep) {
  return cep.replace(/\D/g, "");
}

async function fetchAddressByCep(cep) {
  const cleaned = cleanCep(cep);

  if (cleaned.length !== 8) {
    return null;
  }

  const response = await fetch(`${VIA_CEP_URL}/${cleaned}/json/`);

  if (!response.ok) {
    throw new Error("Erro ao consultar CEP.");
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP inválido.");
  }

  return {
    street: data.logradouro || "",
    neighborhood: data.bairro || "",
    city: data.localidade || "",
    state: data.estado || "",
    uf: data.uf || "",
  };
}

function initCepField() {
  const cepInput = document.getElementById("cep");
  if (!cepInput) return;

  cepInput.addEventListener("input", () => {
    cepInput.value = formatCep(cepInput.value);
  });

  cepInput.addEventListener("blur", async () => {
    const cleaned = cleanCep(cepInput.value);

    if (cleaned.length === 0) return;

    if (cleaned.length !== 8) {
      showToast("CEP inválido.", "warning");
      return;
    }

    showLoading();
    setButtonsDisabled(true);

    try {
      const address = await fetchAddressByCep(cepInput.value);

      if (!address) {
        showToast("CEP inválido.", "error");
        return;
      }

      document.getElementById("street").value = address.street;
      document.getElementById("neighborhood").value = address.neighborhood;
      document.getElementById("city").value = address.city;
      document.getElementById("state").value = address.state;
      document.getElementById("uf").value = address.uf;
    } catch (error) {
      showToast(error.message || "CEP inválido.", "error");
    } finally {
      hideLoading();
      setButtonsDisabled(false);
    }
  });
}
