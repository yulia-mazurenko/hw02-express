const express = require("express");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const { schemas } = require("../../models/contact");

const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
} = require("../../controllers/contacts/contactsControllers");

const isValidId = require("../../middlewares/isValidId");
const router = express.Router();

router.get("/", ctrlWrapper(getAllContacts));

router.get("/:contactId", isValidId, ctrlWrapper(getContactById));

router.post(
  "/",
  validationMiddleware(schemas.joiSchema),
  ctrlWrapper(addContact)
);

router.put(
  "/:contactId",
  isValidId,
  validationMiddleware(schemas.joiSchema),
  ctrlWrapper(updateContact)
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validationMiddleware(schemas.updateFavoriteSchema),
  ctrlWrapper(updateStatusContact)
);

router.delete("/:contactId", isValidId, ctrlWrapper(removeContact));
module.exports = router;
