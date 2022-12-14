const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
  },
});

module.exports = {
  UserModel: mongoose.model("User", userSchema),
  UserSchema: userSchema,
};
