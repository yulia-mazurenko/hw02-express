const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      error.status = 400;
      // const [errorField] = error.details[0].path;
      // error.message = `missing required "${errorField}" field`;
      // throw error;
      next(error);
      return;
    }
    next();
  };
};

module.exports = validationMiddleware;
