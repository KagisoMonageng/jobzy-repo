const express = require('express');
const validate = require('../../middleware/validate');
const { createJobSchema, updateStatusSchema } = require('./jobs.schema');
const controller = require('./jobs.controller');

const clientRoutes = express.Router();
clientRoutes.get('/mine', controller.listMine);
clientRoutes.post('/', validate(createJobSchema), controller.create);

const workerRoutes = express.Router();
workerRoutes.get('/open', controller.listOpen);
workerRoutes.get('/mine', controller.listMine);
workerRoutes.post('/:id/accept', controller.accept);
workerRoutes.patch('/:id/status', validate(updateStatusSchema), controller.updateStatus);

module.exports = { clientRoutes, workerRoutes };
