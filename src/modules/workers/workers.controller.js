const repository = require('./workers.repository');
const { AppError } = require('../../utils/errors');

async function upsertProfile(req, res, next) {
  try {
    const profile = await repository.upsertProfile({
      userId: req.user.sub,
      ...req.body
    });

    if (!profile) {
      throw new AppError(404, 'Worker application not found');
    }

    await repository.replaceWorkerServices(req.user.sub, req.body.serviceIds || []);
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
}

async function discover(req, res, next) {
  try {
    const rows = await repository.discoverWorkers(req.query);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

module.exports = { upsertProfile, discover };
