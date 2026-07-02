const TOAST_DURATION = 4000;

let loadingCount = 0;
let lastToastMessage = "";
let lastToastTime = 0;

function showToast(message, type = "success") {
  const now = Date.now();
  if (message === lastToastMessage && now - lastToastTime < 500) return;

  lastToastMessage = message;
  lastToastTime = now;

  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "alert");

  container.appendChild(toast);

  setTimeout(() => toast.remove(), TOAST_DURATION);
}

function showLoading() {
  loadingCount += 1;
  const overlay = document.getElementById("loading");
  if (overlay) overlay.hidden = false;
}

function hideLoading() {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    const overlay = document.getElementById("loading");
    if (overlay) overlay.hidden = true;
  }
}

function setButtonsDisabled(disabled, container = document) {
  container.querySelectorAll("button, input[type='submit']").forEach((btn) => {
    btn.disabled = disabled;
  });
}

function setButtonLoading(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.classList.toggle("btn--loading", isLoading);
  button.setAttribute("aria-busy", isLoading ? "true" : "false");
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  const group = field.closest(".form-group");
  if (!group) return;

  group.classList.add("form-group--error");

  let errorEl = group.querySelector(".form-group__error");
  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.className = "form-group__error";
    errorEl.setAttribute("role", "alert");
    group.appendChild(errorEl);
  }

  errorEl.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  const group = field.closest(".form-group");
  if (!group) return;

  group.classList.remove("form-group--error");
  const errorEl = group.querySelector(".form-group__error");
  if (errorEl) errorEl.remove();
}

function clearFormErrors(form) {
  if (!form) return;

  form.querySelectorAll(".form-group--error").forEach((group) => {
    group.classList.remove("form-group--error");
    group.querySelector(".form-group__error")?.remove();
  });
}

function applyFormErrors(errors) {
  Object.entries(errors).forEach(([fieldId, message]) => {
    setFieldError(fieldId, message);
  });
}

function showDeleteModal() {
  return new Promise((resolve) => {
    const modal = document.getElementById("delete-modal");
    const cancelBtn = document.getElementById("modal-cancel");
    const confirmBtn = document.getElementById("modal-confirm");

    if (!modal) {
      resolve(false);
      return;
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    function cleanup(result) {
      modal.hidden = true;
      document.body.style.overflow = "";
      cancelBtn.removeEventListener("click", onCancel);
      confirmBtn.removeEventListener("click", onConfirm);
      modal.removeEventListener("click", onOverlayClick);
      document.removeEventListener("keydown", onEscape);
      resolve(result);
    }

    function onCancel() {
      cleanup(false);
    }

    function onConfirm() {
      cleanup(true);
    }

    function onOverlayClick(event) {
      if (event.target === modal) cleanup(false);
    }

    function onEscape(event) {
      if (event.key === "Escape") cleanup(false);
    }

    cancelBtn.addEventListener("click", onCancel);
    confirmBtn.addEventListener("click", onConfirm);
    modal.addEventListener("click", onOverlayClick);
    document.addEventListener("keydown", onEscape);
  });
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

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCep(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

function sanitizeErrorMessage(message) {
  if (!message) return "Ocorreu um erro. Tente novamente.";

  const technicalPatterns = [
    /sql/i,
    /stack/i,
    /undefined/i,
    /null/i,
    /ECONNREFUSED/i,
    /internal server/i,
  ];

  if (technicalPatterns.some((pattern) => pattern.test(message))) {
    return "Ocorreu um erro. Tente novamente.";
  }

  return message;
}
