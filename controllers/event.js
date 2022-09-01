const { EventModel } = require("../models/Event");
const { UserModel } = require("../models/User");
const { Event } = require("../constants/events");
const { EventStatus } = require("../constants/event-status");
const { UserStatus } = require("../constants/user-status");
const pusher = require("../lib/pusher");
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

    await pusher.trigger(eventCode, Event.EventStarted, {
      data: { event: event },
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
  const user = req.body;

  if (!code) {
    return res.status(400).json({
      message: "Event code is required",
    });
  }

  if (!user) {
    return res.status(400).json({
      message: "User is required",
    });
  }

  if (!user.location) {
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
            user: user,
            locations: [user.location],
          },
        },
      },
      { new: true, runValidators: true }
    );

    await pusher.trigger(code, Event.EventParticipantJoin, {
      data: { user: user },
    });

    await pusher.trigger(code, Event.EventParticipantUpdated, {
      data: { event: event },
    });

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

const addUserLocation = async (req, res) => {
  const { code, deviceId } = req.params;
  const location = req.body;

  if (!code) {
    return res.status(400).json({
      message: "Event code is required",
    });
  }

  if (!deviceId) {
    return res.status(400).json({
      message: "Device Id is required",
    });
  }

  if (!location) {
    return res.status(400).json({
      message: "Location is required",
    });
  }

  try {
    const eventExists = await EventModel.where({
      code: code,
    }).findOne();

    if (!eventExists) {
      return res.status(400).json({ message: "Invalid Event code" });
    }

    const userExists = await UserModel.where({ deviceId: deviceId }).findOne();

    if (!userExists) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const event = await EventModel.findOneAndUpdate(
      { code: code, "participants.user.deviceId": deviceId },
      {
        $push: {
          "participants.$.locations": location,
        },
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(400).json({ message: "Unable to add location" });
    }

    await pusher.trigger(code, Event.EventParticipantUpdated, {
      data: { event: event },
    });

    res.status(200).json({
      message: "Added location successfully.",
      data: { event: event },
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const completeEvent = async (req, res) => {
  const { code } = req.params;
  const { deviceId } = req.body;

  if (!code) {
    return res.status(400).json({
      message: "Event code is required",
    });
  }

  if (!deviceId) {
    return res.status(400).json({
      message: "Device Id is required",
    });
  }

  try {
    const eventExists = await EventModel.where({
      code: code,
    }).findOne();

    if (!eventExists) {
      return res.status(400).json({ message: "Invalid Event code" });
    }

    const userExists = await UserModel.where({ deviceId: deviceId }).findOne();

    if (!userExists) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const event = await EventModel.findOneAndUpdate(
      { code: code, "createdBy.deviceId": deviceId },
      {
        status: EventStatus.COMPLETED,
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(400).json({ message: "Unable to complete event" });
    }

    await pusher.trigger(code, Event.EventCompleted, {
      message: "Meetup event completed.",
    });

    res.status(200).json({
      message: "Meetup event completed.",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const cancelEvent = async (req, res) => {
  const { code } = req.params;
  const { deviceId } = req.body;

  if (!code) {
    return res.status(400).json({
      message: "Event code is required",
    });
  }

  if (!deviceId) {
    return res.status(400).json({
      message: "Device Id is required",
    });
  }

  try {
    const eventExists = await EventModel.where({
      code: code,
    }).findOne();

    if (!eventExists) {
      return res.status(400).json({ message: "Invalid Event code" });
    }

    const userExists = await UserModel.where({ deviceId: deviceId }).findOne();

    if (!userExists) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const event = await EventModel.findOneAndUpdate(
      { code: code, "createdBy.deviceId": deviceId },
      {
        status: EventStatus.CANCELLED,
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(400).json({ message: "Unable to cancel event" });
    }

    await pusher.trigger(code, Event.EventCancelled, {
      message: "Meetup event cancelled.",
    });

    res.status(200).json({
      message: "Meetup event cancelled.",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const userCancelled = async (req, res) => {
  const { code, deviceId } = req.params;

  if (!code) {
    return res.status(400).json({
      message: "Event code is required",
    });
  }

  if (!deviceId) {
    return res.status(400).json({
      message: "Device Id is required",
    });
  }

  try {
    const eventExists = await EventModel.where({
      code: code,
    }).findOne();

    if (!eventExists) {
      return res.status(400).json({ message: "Invalid Event code" });
    }

    const user = await UserModel.where({ deviceId: deviceId }).findOne();

    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const event = await EventModel.findOneAndUpdate(
      { code: code, "participants.user.deviceId": deviceId },
      {
        $set: { "participants.$.status": UserStatus.CANCELLED },
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(400).json({ message: "Unable to cancel" });
    }

    await pusher.trigger(code, Event.EventParticipantCancelled, {
      message: "User cancelled successfully.",
      data: { user: user },
    });

    await pusher.trigger(code, Event.EventParticipantUpdated, {
      data: { event: event },
    });

    res.status(200).json({
      message: "User cancelled successfully.",
      data: { event: event },
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  createEvent,
  joinEvent,
  completeEvent,
  getEvent,
  addUserLocation,
  cancelEvent,
  userCancelled,
};
