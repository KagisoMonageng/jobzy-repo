const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const env = require('../../config/env');
const repository = require('./chat.repository');

function registerChatSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));

    try {
      const payload = jwt.verify(token, env.accessTokenSecret);
      socket.user = payload;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('message:send', async (payload) => {
      const saved = await repository.saveMessage({
        id: uuidv4(),
        conversationId: payload.conversationId,
        senderId: socket.user.sub,
        message: payload.message,
        messageType: payload.messageType || 'text'
      });

      io.to(`conversation:${payload.conversationId}`).emit('message:new', saved);
    });
  });
}

module.exports = registerChatSocket;
