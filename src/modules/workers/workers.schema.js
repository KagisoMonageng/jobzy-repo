const Joi = require('joi');

const profileSchema = Joi.object({
  bio: Joi.string().allow('', null),
  yearsExperience: Joi.number().integer().min(0).default(0),
  baseHourlyRate: Joi.number().min(0).required(),
  isAvailable: Joi.boolean().default(true),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  addressText: Joi.string().required(),
  serviceIds: Joi.array().items(Joi.string().uuid()).default([])
});

const discoverSchema = Joi.object({
  serviceId: Joi.string().uuid().optional(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  radiusKm: Joi.number().min(1).max(100).default(20)
});

module.exports = { profileSchema, discoverSchema };
