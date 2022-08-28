const { EventModel } = require("../models/Event");
const crypto = require("crypto");

const createEvent = async (req, res) => {
  const { creator, destination } = req.body;

  if (!creator) {
    return res.status(400).json({
      message: "User is required",
    });
  }

  if (!creator.location) {
    return res.status(400).json({
      message: "User location is required",
    });
  }

  if (!destination) {
    return res.status(400).json({
      message: "Destination is required",
    });
  }

  try {
    let eventCode = "";
    while (true) {
      eventCode = crypto
        .randomBytes(6)
        .toString("hex")
        .slice(0, 6)
        .toUpperCase();

      const eventAlreadyExists = await EventModel.where({
        code: eventCode,
      }).findOne();

      if (!eventAlreadyExists) break;
    }

    const event = await EventModel.create({
      code: eventCode,
      createdBy: creator,
      destination: destination,
      participants: [
        {
          user: creator,
          locations: [creator.location],
        },
      ],
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).send(err);
  }
};

const joinEvent = (req, res) => {
  res.send("Join Event");
};

const completeEvent = (req, res) => {
  res.send("Complete Event");
};

const getEvent = (req, res) => {
  res.send("Get Event");
};

module.exports = {
  createEvent,
  joinEvent,
  completeEvent,
  getEvent,
};
