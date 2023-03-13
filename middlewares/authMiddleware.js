const jwt = require("jsonwebtoken");
const { User } = require("../models");

const { SECRET_KEY } = process.env;

const authMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [type, token] = authorization.split(" ");

  try {
    if (type !== "Bearer") {
      const error = new Error("Not authorized");
      error.status = 401;
      throw error;
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) {
      const error = new Error("Not authorized");
      error.status = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = authMiddleware;
