const { Contact } = require("../../models/contact");

const getAllContacts = async (_, res) => {
  const contacts = await Contact.find();

  res.json({
    status: "success",
    code: 200,
    data: {
      result: contacts,
    },
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    const error = new Error(`Contact with id=${contactId} not found`);
    error.status = 404;
    throw error;
  }
  res.json({
    status: "success",
    code: 200,
    data: {
      contact,
    },
  });
};

const addContact = async (req, res) => {
  const newContact = await Contact.create(req.body);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      newContact,
    },
  });
};

const removeContact = async (req, res) => {
  const { contactId: id } = req.params;
  const deletedContact = await Contact.findByIdAndRemove(id);
  if (!deletedContact) {
    const error = new Error(`Contact with id=${id} not found`);
    error.status = 404;
    throw error;
  }

  res.json({
    status: "success",
    code: 200,
    message: `contact with id="${id}" deleted`,
    data: {
      deletedContact,
    },
  });
};

const updateStatusContact = async (req, res) => {
  const { contactId: id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedContact) {
    const error = new Error(`Contact with id=${id} not found`);
    error.status = 404;
    throw error;
  }
  res.json({
    status: "success",
    code: "200",
    data: {
      updatedContact,
    },
  });
};

const updateContact = async (req, res) => {
  const { contactId: id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedContact) {
    const error = new Error(`Contact with id=${id} not found`);
    error.status = 404;
    throw error;
  }
  res.json({
    status: "success",
    code: "200",
    data: {
      updatedContact,
    },
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateStatusContact,
  updateContact,
};
