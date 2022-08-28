const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { UserSchema } = require("./User");

const { LocationSchema } = require("./Location");

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

module.exports = {
  EventModel: mongoose.model("Event", eventSchema),
  EventSchema: eventSchema,
};
