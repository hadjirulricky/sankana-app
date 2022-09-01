const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { EventStatus } = require("../constants/event-status");

const { UserStatus } = require("../constants/user-status");

const { UserSchema } = require("./User");

const { LocationSchema } = require("./Location");

const eventSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.ON_GOING,
    required: true,
  },
  createdBy: UserSchema,
  destination: LocationSchema,
  participants: [
    {
      user: UserSchema,
      locations: [LocationSchema],
      status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ON_THE_WAY,
        required: true,
      },
    },
  ],
});

module.exports = {
  EventModel: mongoose.model("Event", eventSchema),
  EventSchema: eventSchema,
};
