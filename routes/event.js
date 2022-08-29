const express = require("express");
const router = express.Router();

const {
  createEvent,
  joinEvent,
  completeEvent,
  getEvent,
  addUserLocation,
} = require("../controllers/event");

router.post("/", createEvent);

router.post("/:code/join", joinEvent);

router.post("/:code/complete", completeEvent);

router.get("/:code", getEvent);

router.post("/:code/participants/:deviceId/locations", addUserLocation);

module.exports = router;
