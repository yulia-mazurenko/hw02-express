const Joi = require("joi");

const validationMiddleware = (req, res, next) => {
  const contactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    phone: Joi.string().required(),
  });

  const { error } = contactSchema.validate(req.body);

  if (error) {
    const [errorField] = error.details[0].path;
    error.status = 400;
    error.message = `missing required "${errorField}" field`;
    throw error;
  }
  next();
};

module.exports = validationMiddleware;
