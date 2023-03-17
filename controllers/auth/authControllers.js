const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const { User } = require("../../models");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { password, email, subscription = "starter" } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const error = new Error("Email in use");
    error.status = 409;
    throw error;
  }

  const avatarURL = gravatar.url(email);

  const newUser = new User({ email, subscription, avatarURL });
  newUser.setPassword(password);
  newUser
    .save()
    .then(({ email, subscription, avatarURL }) => {
      res.status(201).json({
        status: "success",
        code: 201,
        data: {
          user: {
            email,
            subscription,
            avatarURL,
          },
        },
      });
    })
    .catch((error) =>
      res.status(409).json({
        status: "error",
        code: 409,
        message: error.message,
      })
    );
};

const login = async (req, res) => {
  const { email, password, subscription = "starter" } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error(`No user with "${email}"`);
    error.status = 401;
    throw error;
  }

  const isPasswordCompared = bcrypt.compareSync(password, user.password);
  if (!isPasswordCompared) {
    const error = new Error("Password is wrong");
    error.status = 401;
    throw error;
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: {
        email,
        subscription,
      },
    },
  });

  await User.findByIdAndUpdate(user._id, { token }, { new: true });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json();
};

module.exports = {
  register,
  login,
  logout,
};
