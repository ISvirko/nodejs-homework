const { Router } = require("express");
const router = Router();

const { validator } = require("../helpers/validator");
const {
  createContactScheme,
  updateContactScheme,
} = require("../helpers/validSchemes");
const { handlerException } = require("../helpers/handlerException");

const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("./contacts.controller");

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
