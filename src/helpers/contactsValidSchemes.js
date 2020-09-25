const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");

exports.createContactScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  subscription: Joi.string().required(),
  password: Joi.string().required(),
});

exports.updateContactScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  subscription: Joi.string(),
  password: Joi.string(),
}).min(1);

exports.contactObjectIdSheme = Joi.object({
  contactId: Joi.string()
    .custom((value, helpers) => {
      const isValidObjectId = ObjectId.isValid(value);

      if (!isValidObjectId) {
        return helpers.error("User id must be of type ObjectId");
      }

      return value;
    })
    .required(),
});
