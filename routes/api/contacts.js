const express = require("express");
const { validationMiddleware } = require("../../middlewares");
const { ctrlWrapper, authMiddleware } = require("../../middlewares");
const { joiSchema, updateFavoriteSchema } = require("../../models");

const { contactsControllers: ctrl } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, ctrlWrapper(ctrl.getAllContacts))
  .post(
    authMiddleware,
    validationMiddleware(joiSchema),
    ctrlWrapper(ctrl.addContact)
  );

router
  .route("/:contactId")
  .get(ctrlWrapper(ctrl.getContactById))
  .put(validationMiddleware(joiSchema), ctrlWrapper(ctrl.updateContact))
  .delete(ctrlWrapper(ctrl.removeContact));

router.patch(
  "/:contactId/favorite",
  validationMiddleware(updateFavoriteSchema),
  ctrlWrapper(ctrl.updateStatusContact)
);

module.exports = router;
