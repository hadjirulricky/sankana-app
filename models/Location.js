const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
  },
});

module.exports = {
  LocationModel: mongoose.model("Location", locationSchema),
  LocationSchema: locationSchema,
};
