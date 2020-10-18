const {
  getContactByIdFromParams,
} = require("../helpers/getContactByIdFromParams");
const contactsModel = require("./contacts.model");

exports.getContacts = async (req, res, next) => {
  const contacts = await contactsModel.listContacts();
  res.json(contacts);
};

exports.getContactById = async (req, res, next) => {
  const contact = await getContactByIdFromParams(req.params, res);
  if (contact) {
    res.json(contact);
  }
};

exports.createContact = async (req, res, next) => {
  const newContact = await contactsModel.addContact(req.body, res);

  if (newContact) {
    res.status(201).json(newContact);
  }
};

exports.updateContact = async (req, res, next) => {
  const contact = await getContactByIdFromParams(req.params, res);

  const updatedContact = await contactsModel.updateContactById(
    contact.id,
    req.body
  );

  res.json(updatedContact);
};

exports.deleteContact = async (req, res, next) => {
  const contact = await getContactByIdFromParams(req.params, res);

  await contactsModel.deleteContactById(contact.id);

  res.sendStatus(204);
};
