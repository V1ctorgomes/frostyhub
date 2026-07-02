document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "login") {
    initLogin();
  }

  if (page === "dashboard") {
    if (!requireAuth()) return;

    initDashboardAuth();
    initCustomers();

    try {
      initCepField();
    } catch {
      showToast("Erro ao iniciar busca de CEP.", "warning");
    }
  }
});
