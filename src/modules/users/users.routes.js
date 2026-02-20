const express = require('express');
const { authenticate } = require('../../middleware/auth');
const controller = require('./users.controller');

const router = express.Router();

router.get('/me', authenticate, controller.me);

module.exports = router;
