const contactsOperations = require("../../models/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsOperations.getAllContacts();

    res.json({
      status: "success",
      code: 200,
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsOperations.getContactById(contactId);
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
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const newContact = await contactsOperations.addContact(req.body);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        newContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId: id } = req.params;
    const deletedContact = await contactsOperations.removeContact(id);
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
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId: id } = req.params;
    const updatedContact = await contactsOperations.updateContact(id, req.body);
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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
