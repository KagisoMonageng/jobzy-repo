const express = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('./auth.schema');
const controller = require('./auth.controller');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7'
});

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', loginLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', validate(refreshSchema), controller.logout);

module.exports = router;
