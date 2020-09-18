const uuid = require("uuid");
const { findContactIdx } = require("../helpers/findContactIdx");
const { modifyContactsDb } = require("../helpers/modifyContactsDb");

const listContacts = async () => {
  try {
    const contacts = await fs.promises.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error);
  }
};

const findContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return await contacts.find((contact) => contact.id === contactId);
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (contactParams) => {
  try {
    const contacts = await listContacts();

    if (contacts.find((contact) => contact.email === contactParams.email))
      return;

    const id = uuid.v4();
    const contactToCreate = { ...contactParams, id };

    return modifyContactsDb(contacts, contactToCreate);
  } catch (error) {
    console.log(error);
  }
};

const updateContactById = async (contactId, updateParams) => {
  try {
    const contacts = await listContacts();
    const contactIdx = findContactIdx(contacts, contactId);

    const contactToUpdate = { ...contacts[contactIdx], ...updateParams };

    return modifyContactsDb(contacts, contactToUpdate);
  } catch (error) {
    console.log(error);
  }
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
