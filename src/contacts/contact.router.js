const { Router } = require("express");
const router = Router();
const { validator } = require("../helpers/validator");
const {
  createContactScheme,
  updateContactScheme,
  contactObjectIdSheme,
} = require("../helpers/contactsValidSchemes");
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("./contact.controller");

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

exports.contactRouter = router;
