const express = require('express');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createConversationSchema } = require('./chat.schema');
const controller = require('./chat.controller');

const router = express.Router();

router.post('/conversations', authenticate, validate(createConversationSchema), controller.createConversation);
router.get('/conversations/:id/messages', authenticate, controller.listMessages);

module.exports = router;
