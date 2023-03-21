const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../../models");
const { RequestError } = require("../../helpers");

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
    throw new RequestError(
      400,
      `"${subscription}" is invalid subscription type`
    );
  }

  const updatedSubscriptionContact = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  if (!updatedSubscriptionContact) {
    throw new RequestError(404, `User with id=${_id} not found`);
  }

  res.json({
    status: "success",
    code: "200",
    data: {
      updatedSubscriptionContact,
    },
  });
};

const updateAvatar = async (req, res) => {
  const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
  const { _id } = req.user;
  const { path: tempAvatarPath, originalname } = req.file;

  try {
    const [extention] = originalname.split(".").reverse();
    const nameWithoutExt = originalname.slice(0, -(extention.length + 1));
    const newAvatarName = `${nameWithoutExt}_${_id}.${extention}`;
    const newAvatarPath = path.join(avatarsDir, newAvatarName);

    Jimp.read(tempAvatarPath, (error, nameWithoutExt) => {
      if (error) throw error;
      nameWithoutExt.resize(250, 250).write(newAvatarPath);
    });

    await fs.unlink(tempAvatarPath);

    const avatarURL = path.join("avatars", newAvatarName);

    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(tempAvatarPath);
    throw error;
  }
};

module.exports = { getCurrentUserData, updateSubscription, updateAvatar };
