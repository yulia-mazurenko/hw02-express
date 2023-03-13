const { User } = require("../../models");

const getCurrentUserData = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  const { email, subscription } = user;

  res.json({
    status: "success",
    code: 200,
    data: {
      email,
      subscription,
    },
  });
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  const subscriptionTypes = ["starter", "pro", "business"];

  const isValidSubscrType = subscriptionTypes.some(
    (type) => type === subscription
  );

  if (!isValidSubscrType) {
    const error = new Error(`"${subscription}" is invalid subscription type`);
    error.status = 400;
    throw error;
  }

  const updatedSubscriptionContact = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  if (!updatedSubscriptionContact) {
    const error = new Error(`User with id=${_id} not found`);
    error.status = 404;
    throw error;
  }

  res.json({
    status: "success",
    code: "200",
    data: {
      updatedSubscriptionContact,
    },
  });
};

module.exports = { getCurrentUserData, updateSubscription };
