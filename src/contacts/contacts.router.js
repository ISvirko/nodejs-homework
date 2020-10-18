const { Router } = require("express");
const router = Router();

const { validator } = require("../helpers/validator");
const Joi = require("joi");

const { handlerException } = require("../helpers/handlerException");

const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("./contacts.controller");

const createContactScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateContactScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
}).min(1);

router.get("/", handlerException(getContacts));

router.get("/:contactId", handlerException(getContactById));

router.post(
  "/",
  validator(createContactScheme),
  handlerException(createContact)
);

router.patch(
  "/:contactId",
  validator(updateContactScheme),
  handlerException(updateContact)
);

router.delete("/:contactId", handlerException(deleteContact));

exports.contactsRouter = router;
