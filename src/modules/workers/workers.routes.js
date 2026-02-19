const express = require('express');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { profileSchema, discoverSchema } = require('./workers.schema');
const controller = require('./workers.controller');

const router = express.Router();

router.get('/discover', validate(discoverSchema, 'query'), controller.discover);
router.put('/profile', authenticate, authorize('worker'), validate(profileSchema), controller.upsertProfile);

module.exports = router;
