const { RequestError } = require("../../helpers");
const { Contact } = require("../../models");

const getAllContacts = async (req, res) => {
  const { _id } = req.user;
  const { page, limit, favorite } = req.query;
  const skip = (page - 1) * limit;

  const contacts = await Contact.find({ owner: _id })
    .skip(skip)
    .limit(Number(limit))
    .find(favorite ? { favorite: JSON.parse(favorite) } : {})
    .populate("owner", "_id email phone");

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
    throw new RequestError(404, `Contact with id=${contactId} not found`);
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
  const { _id } = req.user;

  const newContact = await Contact.create({ ...req.body, owner: _id });

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
    throw new RequestError(404, `Contact with id=${id} not found`);
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
    throw new RequestError(404, `Contact with id=${id} not found`);
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
    throw new RequestError(404, `Contact with id=${id} not found`);
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
