const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.promises.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contactToFind = contacts.find((contact) => contact.id === contactId);

    return contactToFind ? contactToFind : null;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const contactToDelete = await getContactById(contactId);

    if (contactToDelete) {
      const contacts = await listContacts();
      const modifiedContacts = contacts.filter(
        (contact) => contact.id !== contactToDelete.id
      );
      const stringifiedContacts = JSON.stringify(modifiedContacts);

      await fs.promises.writeFile(contactsPath, stringifiedContacts);
    }

    return await listContacts();
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const id = contacts[contacts.length - 1].id + 1;

    if (contacts.find((contact) => contact.email === email)) return contacts;

    const newContact = { id, name, email, phone };
    const modifiedContacts = [...contacts, newContact];
    const stringifiedContacts = JSON.stringify(modifiedContacts);

    await fs.promises.writeFile(contactsPath, stringifiedContacts);

    return modifiedContacts;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
