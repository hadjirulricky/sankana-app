const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = require("./Users");

const LocationSchema = require("./Locations");

const eventSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  createdBy: UserSchema,
  destination: LocationSchema,
  participants: [
    {
      user: UserSchema,
      locations: [LocationSchema],
    },
  ],
});

module.exports = mongoose.model("Event", eventSchema);
