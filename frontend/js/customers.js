let customers = [];
let editingId = null;
let isLoadingCustomers = false;
let isSubmitting = false;

const ACTION_ICONS = {
  view: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
};

function getActionIcon(name) {
  return ACTION_ICONS[name] || "";
}

function openCustomerModal() {
  const modal = document.getElementById("customer-modal");
  if (modal) modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCustomerModal() {
  const modal = document.getElementById("customer-modal");
  if (modal) modal.hidden = true;
  document.body.style.overflow = "";
}

function initCustomerModal() {
  const modal = document.getElementById("customer-modal");
  const closeBtn = document.getElementById("close-customer-modal-btn");

  if (!modal) return;

  closeBtn?.addEventListener("click", () => {
    closeCustomerModal();
    resetForm();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeCustomerModal();
      resetForm();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeCustomerModal();
      resetForm();
    }
  });
}

function closeViewCustomerModal() {
  const modal = document.getElementById("view-customer-modal");
  if (modal) modal.hidden = true;
  document.body.style.overflow = "";
}

function openViewCustomerModal() {
  const modal = document.getElementById("view-customer-modal");
  if (modal) modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function initViewCustomerModal() {
  const modal = document.getElementById("view-customer-modal");
  const closeBtn = document.getElementById("close-view-customer-modal-btn");
  const closeFooterBtn = document.getElementById("view-close-btn");

  if (!modal) return;

  function close() {
    closeViewCustomerModal();
  }

  closeBtn?.addEventListener("click", close);
  closeFooterBtn?.addEventListener("click", close);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) close();
  });
}

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
            ${getActionIcon("view")}
          </button>
          <button type="button" class="btn btn--ghost btn--action-icon" data-action="edit" data-id="${customer.id}" aria-label="Editar ${escapeHtml(customer.name)}" title="Editar">
            ${getActionIcon("edit")}
          </button>
          <button type="button" class="btn btn--ghost btn--action-icon btn--action-icon--danger" data-action="delete" data-id="${customer.id}" aria-label="Excluir ${escapeHtml(customer.name)}" title="Excluir">
            ${getActionIcon("delete")}
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

async function loadCustomers({ force = false, withOverlay = false } = {}) {
  if (isLoadingCustomers && !force) return;

  isLoadingCustomers = true;
  if (withOverlay) showLoading();
  setTableActionButtonsDisabled(true);

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
    if (withOverlay) hideLoading();
    setTableActionButtonsDisabled(false);
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

  showLoading();
  setTableActionButtonsDisabled(true);

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
    setTableActionButtonsDisabled(false);
  }
}

function initCustomers() {
  const openModalBtn = document.getElementById("open-customer-modal-btn");
  const tableBody = document.getElementById("customers-table-body");
  const form = document.getElementById("customer-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const phoneInput = document.getElementById("phone");
  const ufInput = document.getElementById("uf");

  openModalBtn?.addEventListener("click", openNewCustomerModal);

  tableBody?.addEventListener("click", async (event) => {
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

  initCustomerModal();
  initViewCustomerModal();
  loadCustomers();

  if (!form) return;

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

  cancelBtn?.addEventListener("click", () => {
    resetForm();
    closeCustomerModal();
  });

  updateCustomerFormState();
}
