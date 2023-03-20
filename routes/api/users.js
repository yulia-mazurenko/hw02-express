const express = require("express");
const { usersControllers: ctrl } = require("../../controllers");
const {
  ctrlWrapper,
  authMiddleware,
  uploadMiddleware,
} = require("../../middlewares");

const router = express.Router();

router.get("/current", authMiddleware, ctrlWrapper(ctrl.getCurrentUserData));
router.patch("/", authMiddleware, ctrlWrapper(ctrl.updateSubscription));
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  ctrlWrapper(ctrl.updateAvatar)
);

module.exports = router;
