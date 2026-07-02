let customers = [];
let editingId = null;
let nextId = 1;

function getFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    cep: document.getElementById("cep").value.trim(),
    street: document.getElementById("street").value.trim(),
    number: document.getElementById("number").value.trim(),
    complement: document.getElementById("complement").value.trim(),
    neighborhood: document.getElementById("neighborhood").value.trim(),
    city: document.getElementById("city").value.trim(),
    state: document.getElementById("state").value.trim(),
    uf: document.getElementById("uf").value.trim().toUpperCase(),
  };
}

function validateCustomer(data) {
  const required = [
    "name",
    "cep",
    "street",
    "number",
    "neighborhood",
    "city",
    "state",
    "uf",
  ];

  const missing = required.filter((field) => !data[field]);

  if (missing.length > 0) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }
}

function resetForm() {
  document.getElementById("customer-form").reset();
  document.getElementById("customer-id").value = "";
  editingId = null;

  document.getElementById("form-title").textContent = "Cadastrar Cliente";
  document.getElementById("save-btn").hidden = false;
  document.getElementById("update-btn").hidden = true;
  document.getElementById("cancel-btn").hidden = true;
}

function setEditMode(customer) {
  editingId = customer.id;
  document.getElementById("customer-id").value = customer.id;
  document.getElementById("name").value = customer.name;
  document.getElementById("email").value = customer.email || "";
  document.getElementById("phone").value = customer.phone || "";
  document.getElementById("cep").value = customer.cep;
  document.getElementById("street").value = customer.street;
  document.getElementById("number").value = customer.number;
  document.getElementById("complement").value = customer.complement || "";
  document.getElementById("neighborhood").value = customer.neighborhood;
  document.getElementById("city").value = customer.city;
  document.getElementById("state").value = customer.state;
  document.getElementById("uf").value = customer.uf;

  document.getElementById("form-title").textContent = "Editar Cliente";
  document.getElementById("save-btn").hidden = true;
  document.getElementById("update-btn").hidden = false;
  document.getElementById("cancel-btn").hidden = false;

  document.getElementById("name").focus();
}

function renderTable() {
  const tbody = document.getElementById("customers-table-body");
  tbody.innerHTML = "";

  if (customers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="data-table__empty">Nenhum cliente cadastrado.</td>
      </tr>
    `;
    return;
  }

  customers.forEach((customer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(customer.name)}</td>
      <td>${escapeHtml(customer.email || "—")}</td>
      <td>${escapeHtml(customer.phone || "—")}</td>
      <td>${escapeHtml(customer.city)}</td>
      <td>${escapeHtml(customer.state)}</td>
      <td>
        <div class="data-table__actions">
          <button type="button" class="btn btn--ghost btn--sm" data-action="edit" data-id="${customer.id}" aria-label="Editar ${escapeHtml(customer.name)}">
            Editar
          </button>
          <button type="button" class="btn btn--ghost btn--sm" data-action="delete" data-id="${customer.id}" aria-label="Excluir ${escapeHtml(customer.name)}">
            Excluir
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function handleSave(data) {
  showLoading();
  setButtonsDisabled(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 600));

    customers.push({ id: nextId++, ...data });
    renderTable();
    resetForm();
    showToast("Cadastro realizado com sucesso.");
  } finally {
    hideLoading();
    setButtonsDisabled(false);
  }
}

async function handleUpdate(id, data) {
  showLoading();
  setButtonsDisabled(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Cliente não encontrado.");

    customers[index] = { id, ...data };
    renderTable();
    resetForm();
    showToast("Atualização realizada com sucesso.");
  } finally {
    hideLoading();
    setButtonsDisabled(false);
  }
}

async function handleDelete(id) {
  const confirmed = await showDeleteModal();
  if (!confirmed) return;

  showLoading();
  setButtonsDisabled(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 600));

    customers = customers.filter((c) => c.id !== id);
    renderTable();

    if (editingId === id) resetForm();

    showToast("Cliente removido com sucesso.");
  } finally {
    hideLoading();
    setButtonsDisabled(false);
  }
}

function initCustomers() {
  const form = document.getElementById("customer-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const phoneInput = document.getElementById("phone");
  const ufInput = document.getElementById("uf");
  const tableBody = document.getElementById("customers-table-body");

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });
  }

  if (ufInput) {
    ufInput.addEventListener("input", () => {
      ufInput.value = ufInput.value.toUpperCase().slice(0, 2);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const data = getFormData();
      validateCustomer(data);

      if (editingId) {
        await handleUpdate(editingId, data);
      } else {
        await handleSave(data);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  cancelBtn.addEventListener("click", resetForm);

  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const customer = customers.find((c) => c.id === id);

    if (!customer) return;

    if (action === "edit") {
      setEditMode(customer);
    }

    if (action === "delete") {
      try {
        await handleDelete(id);
      } catch (error) {
        showToast(error.message || "Erro ao excluir cliente.", "error");
      }
    }
  });

  renderTable();
}
