const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');
const errorHandler = require('./middleware/error-handler');
const openApiSpec = require('./docs/openapi');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const clientApiRoutes = require('./apis/client.routes');
const workerApiRoutes = require('./apis/worker.routes');
const adminApiRoutes = require('./apis/admin.routes');
const servicesRoutes = require('./modules/services/services.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',') }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get('/api/docs.json', (req, res) => res.json(openApiSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/services', servicesRoutes.publicRoutes);

app.use('/api/client', clientApiRoutes);
app.use('/api/worker', workerApiRoutes);
app.use('/api/admin', adminApiRoutes);

app.use(errorHandler);

module.exports = app;
