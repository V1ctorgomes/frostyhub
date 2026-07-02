const TOAST_DURATION = 4000;

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "alert");

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, TOAST_DURATION);
}

function showLoading() {
  const overlay = document.getElementById("loading");
  if (overlay) overlay.hidden = false;
}

function hideLoading() {
  const overlay = document.getElementById("loading");
  if (overlay) overlay.hidden = true;
}

function setButtonsDisabled(disabled) {
  document.querySelectorAll("button, input[type='submit']").forEach((btn) => {
    btn.disabled = disabled;
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

    function cleanup(result) {
      modal.hidden = true;
      cancelBtn.removeEventListener("click", onCancel);
      confirmBtn.removeEventListener("click", onConfirm);
      resolve(result);
    }

    function onCancel() {
      cleanup(false);
    }

    function onConfirm() {
      cleanup(true);
    }

    cancelBtn.addEventListener("click", onCancel);
    confirmBtn.addEventListener("click", onConfirm);
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
