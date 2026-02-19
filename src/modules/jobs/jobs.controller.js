const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../../utils/errors');
const repository = require('./jobs.repository');

async function create(req, res, next) {
  try {
    const row = await repository.createJob({ id: uuidv4(), clientId: req.user.sub, ...req.body });
    return res.status(201).json(row);
  } catch (error) {
    return next(error);
  }
}

async function accept(req, res, next) {
  try {
    const row = await repository.assignJob(req.params.id, req.user.sub);
    if (!row) throw new AppError(409, 'Job is not open');
    return res.json(row);
  } catch (error) {
    return next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const row = await repository.updateJobStatus(req.params.id, req.body.status);
    if (!row) throw new AppError(404, 'Job not found');
    return res.json(row);
  } catch (error) {
    return next(error);
  }
}

async function listMine(req, res, next) {
  try {
    const rows = await repository.listMyJobs(req.user.sub, req.user.role);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

module.exports = { create, accept, updateStatus, listMine };
