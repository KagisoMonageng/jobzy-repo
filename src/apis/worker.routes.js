const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { requireApprovedWorker, requireActiveSubscription } = require('../middleware/worker-access');
const workersRoutes = require('../modules/workers/workers.routes');
const jobsRoutes = require('../modules/jobs/jobs.routes');
const chatRoutes = require('../modules/chat/chat.routes');
const paymentsRoutes = require('../modules/payments/payments.routes');

const router = express.Router();

router.use(authenticate, authorize('worker'));
router.use('/payments', paymentsRoutes);
router.use('/profile', workersRoutes.workerProfileRoutes);
router.use('/jobs', requireApprovedWorker, requireActiveSubscription, jobsRoutes.workerRoutes);
router.use('/chat', requireApprovedWorker, requireActiveSubscription, chatRoutes);

module.exports = router;
