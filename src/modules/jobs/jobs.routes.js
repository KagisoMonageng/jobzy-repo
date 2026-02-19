const express = require('express');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createJobSchema, updateStatusSchema } = require('./jobs.schema');
const controller = require('./jobs.controller');

const router = express.Router();

router.get('/mine', authenticate, controller.listMine);
router.post('/', authenticate, authorize('client'), validate(createJobSchema), controller.create);
router.post('/:id/accept', authenticate, authorize('worker'), controller.accept);
router.patch('/:id/status', authenticate, validate(updateStatusSchema), controller.updateStatus);

module.exports = router;
