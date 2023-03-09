const ctrlWrapper = require("./ctrlWrapper");

const validationMiddleware = require("./validationMiddleware");
const authMiddleware = require("./authMiddleware");

module.exports = {
  ctrlWrapper,
  validationMiddleware,
  authMiddleware,
};
