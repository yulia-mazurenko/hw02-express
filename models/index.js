const { Contact, joiSchema, updateFavoriteSchema } = require("./contact");
const { User, joiRegisterSchema, joiLoginSchema } = require("./user");

module.exports = {
  Contact,
  joiSchema,
  updateFavoriteSchema,

  User,
  joiRegisterSchema,
  joiLoginSchema,
};
