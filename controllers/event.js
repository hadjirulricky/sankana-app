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

    res
      .status(201)
      .json({ message: "Event created successfully.", data: { event: event } });
  } catch (err) {
    res.status(500).send(err);
  }
};

const joinEvent = async (req, res) => {
  const { code } = req.params;
  const { creator } = req.body;

  if (!code) {
    return res.status(400).json({
      message: "Event code is required",
    });
  }

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

  try {
    const eventAlreadyExists = await EventModel.where({
      code: code,
    }).findOne();

    if (!eventAlreadyExists) {
      return res.status(405).json({
        message: "Event does not exists",
      });
    }

    const event = await EventModel.findOneAndUpdate(
      { code: code },
      {
        $push: {
          participants: {
            user: creator,
            locations: [creator.location],
          },
        },
      },
      { new: true, runValidators: true }
    );

    res
      .status(201)
      .json({ message: "Event joined successfully.", data: { event: event } });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getEvent = async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({
      message: "Event code is required",
    });
  }

  try {
    const event = await EventModel.where({
      code: code,
    }).findOne();

    if (!event) {
      return res.status(400).json({ message: "Invalid Event code" });
    }

    res.status(200).json({ data: { event: event } });
  } catch (err) {
    res.status(500).send(err);
  }
};

const completeEvent = (req, res) => {
  res.send("Complete Event");
};

module.exports = {
  createEvent,
  joinEvent,
  completeEvent,
  getEvent,
};
