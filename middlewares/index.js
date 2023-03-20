const ctrlWrapper = require("./ctrlWrapper");
const validationMiddleware = require("./validationMiddleware");
const authMiddleware = require("./authMiddleware");
const uploadMiddleware = require("./uploadMiddleware");

module.exports = {
  ctrlWrapper,
  validationMiddleware,
  authMiddleware,
  uploadMiddleware,
};
