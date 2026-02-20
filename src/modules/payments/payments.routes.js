const express = require('express');
const validate = require('../../middleware/validate');
const { createPlanSchema, subscribeSchema, confirmPaymentSchema } = require('./payments.schema');
const controller = require('./payments.controller');

const workerRoutes = express.Router();
workerRoutes.get('/plans', controller.listPlans);
workerRoutes.post('/subscribe', validate(subscribeSchema), controller.subscribe);
workerRoutes.get('/transactions', controller.listMine);

const adminRoutes = express.Router();
adminRoutes.post('/plans', validate(createPlanSchema), controller.createPlan);
adminRoutes.get('/plans', controller.listPlans);
adminRoutes.post('/transactions/confirm', validate(confirmPaymentSchema), controller.confirm);

module.exports = { workerRoutes, adminRoutes };
