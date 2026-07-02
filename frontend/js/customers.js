let customers = [];
let editingId = null;
let isLoadingCustomers = false;
let isSubmitting = false;

function getFormData() {
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const complement = document.getElementById("complement").value.trim();

  return {
    name: document.getElementById("name").value.trim(),
    email: email || null,
    phone: phone || null,
    cep: document.getElementById("cep").value.trim(),
    street: document.getElementById("street").value.trim(),
    number: document.getElementById("number").value.trim(),
    complement: complement || null,
    neighborhood: document.getElementById("neighborhood").value.trim(),
    city: document.getElementById("city").value.trim(),
    state: document.getElementById("state").value.trim(),
    uf: document.getElementById("uf").value.trim().toUpperCase(),
  };
}

function updateCustomerFormState() {
  const form = document.getElementById("customer-form");
  const saveBtn = document.getElementById("save-btn");
  const updateBtn = document.getElementById("update-btn");
  const data = getFormData();
  const errors = getCustomerValidationErrors(data);
  const isValid = Object.keys(errors).length === 0;

  clearFormErrors(form);
  applyFormErrors(errors);

  if (saveBtn) saveBtn.disabled = !isValid || isSubmitting;
  if (updateBtn) updateBtn.disabled = !isValid || isSubmitting;
}

function resetForm() {
  const form = document.getElementById("customer-form");
  form.reset();
  document.getElementById("customer-id").value = "";
  editingId = null;

  clearFormErrors(form);
  document.getElementById("form-title").textContent = "Cadastrar Cliente";
  document.getElementById("save-btn").hidden = false;
  document.getElementById("update-btn").hidden = true;

  updateCustomerFormState();
}

function openNewCustomerModal() {
  resetForm();
  openCustomerModal();
  document.getElementById("name").focus();
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

  updateCustomerFormState();
  openCustomerModal();
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

async function loadCustomers() {
  if (isLoadingCustomers) return;

  isLoadingCustomers = true;
  const tableSection = document.querySelector(".dashboard-section");
  showLoading();
  setButtonsDisabled(true, tableSection);

  try {
    customers = await api.getCustomers();
    renderTable();
  } catch (error) {
    if (error.message !== "Sessão expirada.") {
      showToast(
        sanitizeErrorMessage(error.message) || "Erro ao carregar clientes.",
        "error"
      );
    }
  } finally {
    isLoadingCustomers = false;
    hideLoading();
    setButtonsDisabled(false, tableSection);
  }
}

async function handleSave(data) {
  if (isSubmitting) return;

  const saveBtn = document.getElementById("save-btn");
  isSubmitting = true;
  showLoading();
  setButtonLoading(saveBtn, true);
  updateCustomerFormState();

  try {
    const customer = await api.createCustomer(data);
    customers.push(customer);
    renderTable();
    resetForm();
    closeCustomerModal();
    showToast("Cliente cadastrado com sucesso.");
  } catch (error) {
    if (error.message !== "Sessão expirada.") {
      showToast(
        sanitizeErrorMessage(error.message) || "Erro ao salvar cliente.",
        "error"
      );
    }
    throw error;
  } finally {
    isSubmitting = false;
    hideLoading();
    setButtonLoading(saveBtn, false);
    updateCustomerFormState();
  }
}

async function handleUpdate(id, data) {
  if (isSubmitting) return;

  const updateBtn = document.getElementById("update-btn");
  isSubmitting = true;
  showLoading();
  setButtonLoading(updateBtn, true);
  updateCustomerFormState();

  try {
    const customer = await api.updateCustomer(id, data);
    const index = customers.findIndex((c) => c.id === id);

    if (index !== -1) {
      customers[index] = customer;
    }

    renderTable();
    resetForm();
    closeCustomerModal();
    showToast("Cliente atualizado com sucesso.");
  } catch (error) {
    if (error.message !== "Sessão expirada.") {
      showToast(
        sanitizeErrorMessage(error.message) || "Erro ao atualizar cliente.",
        "error"
      );
    }
    throw error;
  } finally {
    isSubmitting = false;
    hideLoading();
    setButtonLoading(updateBtn, false);
    updateCustomerFormState();
  }
}

async function handleDelete(id) {
  const confirmed = await showDeleteModal();
  if (!confirmed) return;

  const tableSection = document.querySelector(".dashboard-section");
  showLoading();
  setButtonsDisabled(true, tableSection);

  try {
    await api.deleteCustomer(id);
    customers = customers.filter((c) => c.id !== id);
    renderTable();

    if (editingId === id) {
      resetForm();
      closeCustomerModal();
    }

    showToast("Cliente removido com sucesso.");
  } catch (error) {
    if (error.message !== "Sessão expirada.") {
      showToast(
        sanitizeErrorMessage(error.message) || "Erro ao excluir cliente.",
        "error"
      );
    }
    throw error;
  } finally {
    hideLoading();
    setButtonsDisabled(false, tableSection);
  }
}

function initCustomers() {
  const form = document.getElementById("customer-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const openModalBtn = document.getElementById("open-customer-modal-btn");
  const phoneInput = document.getElementById("phone");
  const ufInput = document.getElementById("uf");
  const tableBody = document.getElementById("customers-table-body");

  initCustomerModal();

  openModalBtn?.addEventListener("click", openNewCustomerModal);

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input.id);
      updateCustomerFormState();
    });
  });

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
    if (isSubmitting) return;

    const data = getFormData();
    const errors = getCustomerValidationErrors(data);

    clearFormErrors(form);
    applyFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("Preencha os campos obrigatórios corretamente.", "warning");
      return;
    }

    try {
      if (editingId) {
        await handleUpdate(editingId, data);
      } else {
        await handleSave(data);
      }
    } catch {
      // Erros já exibidos nos handlers
    }
  });

  cancelBtn.addEventListener("click", () => {
    resetForm();
    closeCustomerModal();
  });

  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || isLoadingCustomers) return;

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
      } catch {
        // Erro já exibido no handler
      }
    }
  });

  updateCustomerFormState();
  loadCustomers();
}
