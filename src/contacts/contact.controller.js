const ContactModel = require("./contact.model");

exports.getContacts = async (req, res, next) => {
  try {
    const { page, limit, sub } = req.query;

    const contacts = await ContactModel.paginate(
      { subscription: sub },
      { page: page || 1, limit: limit || 20 }
    );

    console.log(contacts);

    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await ContactModel.findById(contactId);

    if (!contact) {
      return res.status(404).send("Contact not found");
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const existingContact = await ContactModel.findOne({
      email: req.body.email,
    });

    if (existingContact) {
      return res.status(409).send("Contact with such email already exists");
    }

    const newContact = await ContactModel.create(req.body);

    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).send("Contact not found");
    }

    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await ContactModel.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).send("Contact not found");
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
