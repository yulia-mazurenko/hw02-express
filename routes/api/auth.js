const express = require("express");
const { authControllers: ctrl } = require("../../controllers");
const {
  ctrlWrapper,
  validationMiddleware,
  authMiddleware,
} = require("../../middlewares");
const { joiRegisterSchema, joiLoginSchema } = require("../../models");

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(joiRegisterSchema),
  ctrlWrapper(ctrl.register)
);
router.post(
  "/login",
  validationMiddleware(joiLoginSchema),
  ctrlWrapper(ctrl.login)
);
router.post("/logout", authMiddleware, ctrlWrapper(ctrl.logout));

module.exports = router;
