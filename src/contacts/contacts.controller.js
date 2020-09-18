const {
  getContactByIdFromParams,
} = require("../helpers/getContactByIdFromParams");
const contactsModel = require("./contacts.model");

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await contactsModel.listContacts();

    res.status(200).send(contacts);
  } catch (error) {
    next({ message: error });
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const contact = await getContactByIdFromParams(req.params, res);

    contact && res.status(200).send(contact);
  } catch (error) {
    next({ message: error });
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const newContact = await contactsModel.addContact(req.body);

    newContact
      ? res.status(201).send(newContact)
      : res.status(409).send({ message: "Contact already exists" });
  } catch (error) {
    next({ message: error });
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const contact = await getContactByIdFromParams(req.params, res);

    const updatedContact = await contactsModel.updateContactById(
      contact.id,
      req.body
    );

    res.status(200).send(updatedContact);
  } catch (error) {
    next({ message: error });
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await getContactByIdFromParams(req.params, res);

    await contactsModel.deleteContactById(contact.id);

    res.status(204).send();
  } catch (error) {
    next({ message: error });
  }
};
