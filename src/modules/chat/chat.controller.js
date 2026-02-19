const { v4: uuidv4 } = require('uuid');
const repository = require('./chat.repository');

async function createConversation(req, res, next) {
  try {
    const conversation = await repository.createConversation({ id: uuidv4(), jobId: req.body.jobId });
    return res.status(201).json(conversation);
  } catch (error) {
    return next(error);
  }
}

async function listMessages(req, res, next) {
  try {
    const messages = await repository.listMessages(req.params.id);
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
}

module.exports = { createConversation, listMessages };
