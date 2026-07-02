document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "login") {
    initLogin();
  }

  if (page === "dashboard") {
    if (!requireAuth()) return;

    initDashboardAuth();

    try {
      initCustomers();
    } catch (error) {
      console.error("Erro ao iniciar clientes:", error);
      showToast("Erro ao carregar a página de clientes.", "error");
    }

    try {
      initCepField();
    } catch {
      showToast("Erro ao iniciar busca de CEP.", "warning");
    }
  }
});
