const Joi = require('joi');

const createReviewSchema = Joi.object({
  jobId: Joi.string().uuid().required(),
  revieweeId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('', null)
});

module.exports = { createReviewSchema };
