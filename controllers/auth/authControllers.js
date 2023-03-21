const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const { User } = require("../../models");
const { RequestError, sendEmail } = require("../../helpers/");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { password, email, subscription = "starter" } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw new RequestError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();

  const newUser = new User({
    email,
    subscription,
    avatarURL,
    verificationToken,
  });
  newUser.setPassword(password);
  newUser
    .save()
    .then(({ email, subscription, avatarURL, verificationToken }) => {
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

  const msg = {
    to: email,
    subject: "Verification",
    html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Click here to confirm your email</a>`,
  };

  await sendEmail(msg);
};

const verificationEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new RequestError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  res.json({
    status: "success",
    code: 200,
    data: {
      message: "Verification successful",
    },
  });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    throw new RequestError(404, "User not found");
  }

  if (user.verify) {
    throw new RequestError(400, "Verification has already been passed");
  }

  const msg = {
    to: email,
    subject: "Verification",
    html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}" target="_blank">Click here to confirm your email</a>`,
  };
  await sendEmail(msg);
  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password, subscription = "starter" } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new RequestError(401, `No user with "${email}"`);
  }

  const isPasswordCompared = bcrypt.compareSync(password, user.password);
  if (!isPasswordCompared) {
    throw new RequestError(401, "Password is wrong");
  }

  if (!user.verify) {
    throw new RequestError(401, "User email is not verified");
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
  verificationEmail,
  resendVerificationEmail,
  logout,
};
