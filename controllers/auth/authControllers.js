const jwt = require("jsonwebtoken");

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

  const newUser = new User({ email, subscription });
  newUser.setPassword(password);
  newUser
    .save()
    .then(({ email, subscription }) => {
      res.status(201).json({
        status: "success",
        code: 201,
        data: {
          user: {
            email,
            subscription,
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

  if (!user || !user.comparePassword(password)) {
    const error = new Error("Email or password is wrong");
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
  const user = await User.findByIdAndUpdate(_id, { token: null });

  if (!user) {
    const error = new Error("Not authorized");
    error.status = 401;
    throw error;
  }

  res.status(204).json();
};

module.exports = {
  register,
  login,
  logout,
};
