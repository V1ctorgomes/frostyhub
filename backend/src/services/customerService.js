const AppError = require("../utils/AppError");
const { customerQueries, query } = require("../database/queries");

async function list(userId) {
  const result = await query(customerQueries.findAllByUser, [userId]);
  return result.rows;
}

async function getById(id, userId) {
  const result = await query(customerQueries.findByIdAndUser, [id, userId]);

  if (result.rows.length === 0) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  return result.rows[0];
}

async function create(data, userId) {
  const result = await query(customerQueries.create, [
    data.name,
    data.email || null,
    data.phone || null,
    data.cep,
    data.street,
    data.number,
    data.complement || null,
    data.neighborhood,
    data.city,
    data.state,
    data.uf,
    userId,
  ]);

  return result.rows[0];
}

async function update(id, data, userId) {
  const result = await query(customerQueries.update, [
    data.name,
    data.email || null,
    data.phone || null,
    data.cep,
    data.street,
    data.number,
    data.complement || null,
    data.neighborhood,
    data.city,
    data.state,
    data.uf,
    id,
    userId,
  ]);

  if (result.rows.length === 0) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  return result.rows[0];
}

async function remove(id, userId) {
  const result = await query(customerQueries.delete, [id, userId]);

  if (result.rows.length === 0) {
    throw new AppError("Cliente não encontrado.", 404);
  }
}

module.exports = { list, getById, create, update, remove };
