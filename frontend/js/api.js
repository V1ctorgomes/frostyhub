// Funções de comunicação HTTP — serão implementadas nos próximos PRDs

async function request(endpoint, options = {}) {
  const url = `${CONFIG.API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  return response.json();
}
