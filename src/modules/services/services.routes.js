const express = require('express');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createServiceSchema } = require('./services.schema');
const controller = require('./services.controller');

const router = express.Router();

router.get('/', controller.list);
router.post('/', authenticate, authorize('admin'), validate(createServiceSchema), controller.create);

module.exports = router;
