const { Schema, model, SchemaTypes } = require("mongoose");
const Joi = require("joi");

const { handleSchemaValidationErrors } = require("../helpers");

const phoneRegexp = /^\(\d{3}\) \d{3}-\d{4}$/;

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set contact's email"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Set contact's phone"],
      match: phoneRegexp,
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSchemaValidationErrors);

const joiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().pattern(phoneRegexp).required(),
  favorite: Joi.bool(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.bool().required().messages({
    "any.required": `missing field favorite`,
  }),
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, joiSchema, updateFavoriteSchema };
