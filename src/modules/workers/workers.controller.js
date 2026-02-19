const { v4: uuidv4 } = require('uuid');
const repository = require('./workers.repository');

async function upsertProfile(req, res, next) {
  try {
    const profile = await repository.upsertProfile({
      id: uuidv4(),
      userId: req.user.sub,
      ...req.body
    });

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
