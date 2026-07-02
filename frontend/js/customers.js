let customers = [];
let editingId = null;
let isLoadingCustomers = false;
let isSubmitting = false;

function getFormData() {
  const form = document.getElementById("customer-form");
  const email = form.querySelector("#email").value.trim();
  const phone = form.querySelector("#phone").value.trim();
  const complement = form.querySelector("#complement").value.trim();

  return {
    name: form.querySelector("#name").value.trim(),
    email: email || null,
    phone: phone || null,
    cep: form.querySelector("#cep").value.trim(),
    street: form.querySelector("#street").value.trim(),
    number: form.querySelector("#number").value.trim(),
    complement: complement || null,
    neighborhood: form.querySelector("#neighborhood").value.trim(),
    city: form.querySelector("#city").value.trim(),
    state: form.querySelector("#state").value.trim(),
    uf: form.querySelector("#uf").value.trim().toUpperCase(),
  };
}

function setCustomerFormMode(mode) {
  const saveBtn = document.getElementById("save-btn");
  const updateBtn = document.getElementById("update-btn");
  const isEdit = mode === "edit";

  if (saveBtn) {
    saveBtn.hidden = isEdit;
    saveBtn.type = isEdit ? "button" : "submit";
    saveBtn.disabled = isSubmitting;
  }

  if (updateBtn) {
    updateBtn.hidden = !isEdit;
    updateBtn.type = isEdit ? "submit" : "button";
    updateBtn.disabled = isSubmitting;
  }
}

function updateCustomerFormState() {
  setCustomerFormMode(editingId ? "edit" : "create");
}

function resetForm() {
  const form = document.getElementById("customer-form");
  form.reset();
  document.getElementById("customer-id").value = "";
  editingId = null;

  clearFormErrors(form);
  document.getElementById("form-title").textContent = "Cadastrar Cliente";
  setCustomerFormMode("create");

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
  setCustomerFormMode("edit");

  updateCustomerFormState();
  openCustomerModal();
  document.getElementById("name").focus();
}

function showViewCustomer(customer) {
  document.getElementById("view-name").textContent = customer.name || "—";
  document.getElementById("view-email").textContent = customer.email || "—";
  document.getElementById("view-phone").textContent = customer.phone || "—";
  document.getElementById("view-cep").textContent = customer.cep || "—";
  document.getElementById("view-street").textContent = customer.street || "—";
  document.getElementById("view-number").textContent = customer.number || "—";
  document.getElementById("view-complement").textContent =
    customer.complement || "—";
  document.getElementById("view-neighborhood").textContent =
    customer.neighborhood || "—";
  document.getElementById("view-city").textContent = customer.city || "—";
  document.getElementById("view-state").textContent = customer.state || "—";
  document.getElementById("view-uf").textContent = customer.uf || "—";

  openViewCustomerModal();
}

function renderTableError(message) {
  const tbody = document.getElementById("customers-table-body");
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="data-table__empty data-table__error">${escapeHtml(message)}</td>
    </tr>
  `;
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
          <button type="button" class="btn btn--ghost btn--action-icon" data-action="view" data-id="${customer.id}" aria-label="Ver ${escapeHtml(customer.name)}" title="Ver cliente">
            ${getIcon("view")}
          </button>
          <button type="button" class="btn btn--ghost btn--action-icon" data-action="edit" data-id="${customer.id}" aria-label="Editar ${escapeHtml(customer.name)}" title="Editar">
            ${getIcon("edit")}
          </button>
          <button type="button" class="btn btn--ghost btn--action-icon btn--action-icon--danger" data-action="delete" data-id="${customer.id}" aria-label="Excluir ${escapeHtml(customer.name)}" title="Excluir">
            ${getIcon("delete")}
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

async function loadCustomers({ force = false } = {}) {
  if (isLoadingCustomers && !force) return;

  isLoadingCustomers = true;
  const tableSection = document.querySelector(".dashboard-section");
  showLoading();
  setButtonsDisabled(true, tableSection);

  try {
    if (!localStorage.getItem("token")) {
      throw new Error("Sessão não encontrada. Faça login novamente.");
    }

    const data = await api.getCustomers();
    customers = data;
    renderTable();
  } catch (error) {
    customers = [];

    if (error.message === "Sessão expirada.") {
      renderTable();
      return;
    }

    const message =
      sanitizeErrorMessage(error.message) || "Erro ao carregar clientes.";
    renderTableError(message);
    showToast(message, "error");
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
    await api.createCustomer(data);
    await loadCustomers({ force: true });
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
    await api.updateCustomer(id, data);
    await loadCustomers({ force: true });
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
    await loadCustomers({ force: true });

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

  loadCustomers();

  initCustomerModal();
  initViewCustomerModal();

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

    if (action === "view") {
      showViewCustomer(customer);
    }

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
}
