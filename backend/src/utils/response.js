function successResponse(message, data = null) {
  const response = { success: true, message };

  if (data !== null) {
    response.data = data;
  }

  return response;
}

function errorResponse(message) {
  return { success: false, message };
}

module.exports = { successResponse, errorResponse };
