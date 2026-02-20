const workersRepository = require('../modules/workers/workers.repository');
const { AppError } = require('../utils/errors');

async function requireApprovedWorker(req, res, next) {
  const state = await workersRepository.getWorkerAccessState(req.user.sub);
  if (!state) {
    return next(new AppError(403, 'Worker application not found'));
  }

  if (state.verification_status !== 'approved' || state.background_check_status !== 'approved') {
    return next(new AppError(403, 'Worker account pending admin verification/background check'));
  }

  req.workerState = state;
  return next();
}

async function requireActiveSubscription(req, res, next) {
  const state = req.workerState || (await workersRepository.getWorkerAccessState(req.user.sub));
  if (!state || state.subscription_status !== 'active') {
    return next(new AppError(402, 'Active worker subscription required'));
  }

  req.workerState = state;
  return next();
}

module.exports = { requireApprovedWorker, requireActiveSubscription };
