const { UserModel } = require("../models/User");

const registerUser = async (req, res) => {
  const { deviceId, name, photoUrl } = req.body;
  if (!deviceId) {
    return res.status(400).json({
      message: "Device Id is required",
    });
  }

  if (!name) {
    return res.status(400).json({
      message: "Name is required.",
    });
  }

  try {
    const query = UserModel.where({ deviceId: deviceId });
    const userAlreadyExists = await query.findOne();

    if (userAlreadyExists)
      return res.status(400).json({ message: "User already exists." });

    const newUser = new UserModel({
      name: name,
      deviceId: deviceId,
      photoUrl: photoUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: "User successfully added.",
      data: { user: newUser },
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getUser = async (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId) {
    return res.status(400).json({
      message: "Device Id is required",
    });
  }

  try {
    const user = await UserModel.where({ deviceId: deviceId }).findOne();

    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    res.status(200).json({
      message: "Success",
      data: { user: user },
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { registerUser, getUser };
