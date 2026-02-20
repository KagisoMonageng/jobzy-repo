const express = require('express');
const validate = require('../../middleware/validate');
const { createServiceSchema } = require('./services.schema');
const controller = require('./services.controller');

const publicRoutes = express.Router();
publicRoutes.get('/', controller.list);

const adminRoutes = express.Router();
adminRoutes.post('/', validate(createServiceSchema), controller.create);
adminRoutes.get('/', controller.list);

module.exports = { publicRoutes, adminRoutes };
