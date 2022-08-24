const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UsersSchema = require('./Users')

const LocationsSchema = require('./Locations')

const eventSchema = new Schema({
    code: {
      type: String,
      required: true,
    },
    createdBy: UsersSchema,
    destination: LocationsSchema,
    participants: [
      {
        user: UsersSchema,
        locations: [LocationsSchema],
      }
    ]
  })

  module.exports = mongoose.model('Events', eventSchema)