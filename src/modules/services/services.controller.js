const { v4: uuidv4 } = require('uuid');
const repository = require('./services.repository');

async function list(req, res, next) {
  try {
    const rows = await repository.listActiveServices();
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const row = await repository.createService({ id: uuidv4(), ...req.body });
    return res.status(201).json(row);
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create };
