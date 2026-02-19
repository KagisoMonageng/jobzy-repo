const Joi = require('joi');

const createConversationSchema = Joi.object({
  jobId: Joi.string().uuid().required()
});

const createMessageSchema = Joi.object({
  message: Joi.string().required(),
  messageType: Joi.string().valid('text', 'image', 'file').default('text')
});

module.exports = { createConversationSchema, createMessageSchema };
