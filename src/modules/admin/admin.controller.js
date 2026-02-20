const workersRepository = require('../workers/workers.repository');

async function pendingWorkers(req, res, next) {
  try {
    const workers = await workersRepository.listPendingApplications();
    return res.json(workers);
  } catch (error) {
    return next(error);
  }
}

async function reviewWorker(req, res, next) {
  try {
    const reviewed = await workersRepository.reviewApplication({
      workerId: req.params.workerId,
      adminId: req.user.sub,
      verificationStatus: req.body.verificationStatus,
      backgroundCheckStatus: req.body.backgroundCheckStatus,
      rejectionReason: req.body.rejectionReason
    });

    return res.json(reviewed);
  } catch (error) {
    return next(error);
  }
}

module.exports = { pendingWorkers, reviewWorker };
