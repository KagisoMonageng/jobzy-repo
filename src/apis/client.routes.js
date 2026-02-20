const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const jobsRoutes = require('../modules/jobs/jobs.routes');
const workersRoutes = require('../modules/workers/workers.routes');
const reviewsRoutes = require('../modules/reviews/reviews.routes');
const chatRoutes = require('../modules/chat/chat.routes');

const router = express.Router();

router.use('/jobs', authenticate, authorize('client'), jobsRoutes.clientRoutes);
router.use('/workers', workersRoutes.clientRoutes);
router.use('/reviews', authenticate, authorize('client'), reviewsRoutes);
router.use('/chat', authenticate, chatRoutes);

module.exports = router;
