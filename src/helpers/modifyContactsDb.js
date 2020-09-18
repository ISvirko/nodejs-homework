const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "../../db/contacts.json");

exports.modifyContactsDb = async (contacts, newContact = null) => {
  const modifiedContacts = JSON.stringify(
    newContact ? [...contacts, newContact] : contacts
  );
  await fs.promises.writeFile(contactsPath, modifiedContacts);

  return newContact && newContact;
};
