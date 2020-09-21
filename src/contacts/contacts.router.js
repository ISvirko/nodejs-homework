const { Router } = require("express");
const router = Router();
const { validator } = require("../helpers/validator");
const {
  createContactScheme,
  updateContactScheme,
  contactObjectIdSheme,
} = require("../helpers/validSchemes");
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("./contacts.controller");

// REQUESTS

router.get("/", getContacts);

router.get(
  "/:contactId",
  validator(contactObjectIdSheme, "params"),
  getContactById
);

router.post("/", validator(createContactScheme), createContact);

router.patch("/:contactId", validator(updateContactScheme), updateContact);

router.delete("/:contactId", deleteContact);

exports.contactsRouter = router;
