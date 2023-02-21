const express = require("express");

const {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../controllers/contacts/contactsControllers");

const validationMiddleware = require("../../middlewares/validationMiddleware");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", getContactById);

router.post("/", validationMiddleware, addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", validationMiddleware, updateContact);

module.exports = router;
