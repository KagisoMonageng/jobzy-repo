const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/env');
const registerChatSocket = require('./modules/chat/chat.socket');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',')
  }
});

registerChatSocket(io);

server.listen(env.port, () => {
  console.log(`API running on port ${env.port}`);
});
