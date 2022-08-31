const express = require("express");
const router = express.Router();

const {
  createEvent,
  joinEvent,
  completeEvent,
  getEvent,
  addUserLocation,
  cancelEvent,
} = require("../controllers/event");

router.post("/", createEvent);

router.post("/:code/join", joinEvent);

router.put("/:code/complete", completeEvent);

router.get("/:code", getEvent);

router.post("/:code/participants/:deviceId/locations", addUserLocation);

router.put("/:code/cancel", cancelEvent);

module.exports = router;
