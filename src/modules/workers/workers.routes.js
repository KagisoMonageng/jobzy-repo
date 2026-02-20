const express = require('express');
const validate = require('../../middleware/validate');
const { profileSchema, discoverSchema } = require('./workers.schema');
const controller = require('./workers.controller');

const clientRoutes = express.Router();
clientRoutes.get('/discover', validate(discoverSchema, 'query'), controller.discover);

const workerProfileRoutes = express.Router();
workerProfileRoutes.put('/', validate(profileSchema), controller.upsertProfile);

module.exports = { clientRoutes, workerProfileRoutes };
