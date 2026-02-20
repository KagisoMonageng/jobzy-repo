const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const adminController = require('../modules/admin/admin.controller');
const { reviewWorkerSchema } = require('../modules/admin/admin.schema');
const servicesRoutes = require('../modules/services/services.routes');
const paymentsRoutes = require('../modules/payments/payments.routes');

const router = express.Router();

router.use(authenticate, authorize('admin'));
router.get('/workers/pending', adminController.pendingWorkers);
router.patch('/workers/:workerId/review', validate(reviewWorkerSchema), adminController.reviewWorker);
router.use('/services', servicesRoutes.adminRoutes);
router.use('/subscriptions', paymentsRoutes.adminRoutes);

module.exports = router;
