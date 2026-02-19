const express = require('express');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createReviewSchema } = require('./reviews.schema');
const controller = require('./reviews.controller');

const router = express.Router();

router.post('/', authenticate, authorize('client'), validate(createReviewSchema), controller.create);

module.exports = router;
