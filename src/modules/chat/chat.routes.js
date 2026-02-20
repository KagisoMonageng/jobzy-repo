const express = require('express');
const validate = require('../../middleware/validate');
const { createConversationSchema } = require('./chat.schema');
const controller = require('./chat.controller');

const router = express.Router();

router.post('/conversations', validate(createConversationSchema), controller.createConversation);
router.get('/conversations/:id/messages', controller.listMessages);

module.exports = router;
