const { Router } = require("express");
const router = Router();

const { validator } = require("../helpers/validator");
const {
  createContactScheme,
  updateContactScheme,
} = require("../helpers/validSchemes");

const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("./contacts.controller");

router.get("/", getContacts);

router.get("/:contactId", getContactById);

router.post("/", validator(createContactScheme), createContact);

router.patch("/:contactId", validator(updateContactScheme), updateContact);

router.delete("/:contactId", deleteContact);

exports.contactsRouter = router;
