const fsPromises = require("fs").promises;
const path = require("path");
const uuid = require("uuid");

const contactsPath = path.join(__dirname, "../../db/contacts.json");

// GET ALL CONTACTS
const listContacts = async () => {
  const contacts = await fsPromises.readFile(contactsPath);
  return JSON.parse(contacts);
};

getContactByIdFromParams = async ({ contactId }) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(
      (contact) => contact.id.toString() === contactId
    );

    return contact ? contact : null;
  } catch (error) {
    console.log(error);
  }
};

// GET CONTACT BY ID
const findContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const modifyContactsDb = async (contacts, newContact = null) => {
  const modifiedContacts = JSON.stringify(
    newContact ? [...contacts, newContact] : contacts
  );
  await fsPromises.writeFile(contactsPath, modifiedContacts);

  return newContact ? newContact : null;
};

// ADD CONTACT
const addContact = async (contactParams, res) => {
  const contacts = await listContacts();

  if (contacts.some((contact) => contact.email === contactParams.email))
    return res.status(409).send({ message: "Contact already exists" });

  const id = uuid.v4();
  const contactToCreate = { ...contactParams, id };

  return modifyContactsDb(contacts, contactToCreate);
};

const findContactIdx = (contacts, contactId) => {
  const contactIdx = contacts.findIndex((contact) => contact.id === contactId);

  return contactIdx === -1 ? null : contactIdx;
};

// UPDATE CONTACT
const updateContactById = async (contactId, updateParams) => {
  const contacts = await listContacts();
  const contactIdx = findContactIdx(contacts, contactId);

  if (contactIdx) {
    const contactToUpdate = { ...contacts[contactIdx], ...updateParams };
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactToUpdate.id
    );
    return modifyContactsDb(updatedContacts, contactToUpdate);
  } else {
    return null;
  }
};

// DELETE CONTACT
const deleteContactById = async (contactId) => {
  const contacts = await listContacts();

  const contactIdx = findContactIdx(contacts, contactId);

  if (contactIdx) {
    const modifiedContacts = contacts.splice(contactIdx, 1);

    return modifyContactsDb(modifiedContacts);
  } else {
    return null;
  }
};

module.exports = {
  listContacts,
  findContactById,
  addContact,
  updateContactById,
  deleteContactById,
  getContactByIdFromParams,
};
