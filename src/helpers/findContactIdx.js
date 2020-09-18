exports.findContactIdx = (contacts, contactId) => {
  const contactIdx = contacts.findIndex((contact) => contact.id === contactId);

  return contactIdx === -1 ? null : contactIdx;
};
