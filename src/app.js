const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const errorHandler = require('./middleware/error-handler');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const servicesRoutes = require('./modules/services/services.routes');
const workersRoutes = require('./modules/workers/workers.routes');
const jobsRoutes = require('./modules/jobs/jobs.routes');
const reviewsRoutes = require('./modules/reviews/reviews.routes');
const chatRoutes = require('./modules/chat/chat.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',') }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

module.exports = app;
