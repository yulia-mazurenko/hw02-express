const jwt = require("jsonwebtoken");
const { RequestError } = require("../helpers");
const { User } = require("../models");

const { SECRET_KEY } = process.env;

const authMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [type, token] = authorization.split(" ");

  try {
    if (type !== "Bearer") {
      throw new RequestError(401, "Not authorized");
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw new RequestError(401, "Not authorized");
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
