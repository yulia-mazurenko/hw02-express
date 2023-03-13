const express = require("express");
const { usersControllers: ctrl } = require("../../controllers");
const { ctrlWrapper, authMiddleware } = require("../../middlewares");

const router = express.Router();

router.get("/current", authMiddleware, ctrlWrapper(ctrl.getCurrentUserData));
router.patch("/", authMiddleware, ctrlWrapper(ctrl.updateSubscription));

module.exports = router;
