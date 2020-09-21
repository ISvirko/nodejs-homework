const contactsModel = require("../contacts/contacts.model");

exports.getContactByIdFromParams = async ({ contactId }, res) => {
  try {
    const contacts = await contactsModel.listContacts();
    const contact = await contacts.find(
      (contact) => contact.id.toString() === contactId
    );

    if (contact) {
      return contact;
    } else {
      return res.status(404).send("Contact not found");
    }
  } catch (error) {
    console.log(error);
  }
};
