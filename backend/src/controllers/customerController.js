const customerService = require("../services/customerService");
const { successResponse } = require("../utils/response");

async function list(req, res, next) {
  try {
    const customers = await customerService.list(req.user.id);
    res.status(200).json(
      successResponse("Clientes listados com sucesso.", customers)
    );
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const customer = await customerService.getById(req.params.id, req.user.id);
    res.status(200).json(
      successResponse("Cliente encontrado com sucesso.", customer)
    );
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const customer = await customerService.create(req.body, req.user.id);
    res.status(201).json(
      successResponse("Cliente cadastrado com sucesso.", customer)
    );
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const customer = await customerService.update(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json(
      successResponse("Cliente atualizado com sucesso.", customer)
    );
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await customerService.remove(req.params.id, req.user.id);
    res.status(200).json(
      successResponse("Cliente excluído com sucesso.")
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, remove };
