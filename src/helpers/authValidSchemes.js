const Joi = require("joi");

exports.registerScheme = Joi.object({
  email: Joi.string().email().required(),
  subscription: Joi.string().required(),
  password: Joi.string().required(),
});

exports.loginScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
