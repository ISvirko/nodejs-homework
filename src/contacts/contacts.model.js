const fsPromises = require("fs").promises;
const path = require("path");
const uuid = require("uuid");
const { findContactIdx } = require("../helpers/findContactIdx");
const { modifyContactsDb } = require("../helpers/modifyContactsDb");

const contactsPath = path.join(__dirname, "../../db/contacts.json");

const listContacts = async () => {
  const contacts = await fsPromises.readFile(contactsPath);
  return JSON.parse(contacts);
};

const findContactById = async (contactId) => {
  const contacts = await listContacts();
  return await contacts.find((contact) => contact.id === contactId);
};

const addContact = async (contactParams, res) => {
  const contacts = await listContacts();

  if (contacts.find((contact) => contact.email === contactParams.email))
    return res.status(409).send({ message: "Contact already exists" });

  const id = uuid.v4();
  const contactToCreate = { ...contactParams, id };

  return modifyContactsDb(contacts, contactToCreate);
};

const updateContactById = async (contactId, updateParams) => {
  const contacts = await listContacts();
  const contactIdx = findContactIdx(contacts, contactId);

  const contactToUpdate = { ...contacts[contactIdx], ...updateParams };

  return modifyContactsDb(contacts, contactToUpdate);
};

const deleteContactById = async (contactId) => {
  const contacts = await listContacts();

  const contactIdx = findContactIdx(contacts, contactId);
  const modifiedContacts = contacts.splice(contactIdx, 1);

  return modifyContactsDb(modifiedContacts);
};

module.exports = {
  listContacts,
  findContactById,
  addContact,
  updateContactById,
  deleteContactById,
};
