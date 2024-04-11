const express = require("express");
const Meeting = require("../models/meeting");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config/database");

// Middleware that checks for valid Vote JWT bearer token
async function verifyVoteAccess(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.sendStatus(401); // unauthorized
  }
  try {
    const { meetingId } = jwt.verify(token, config.secret);
    req.meetingId = meetingId;
    next();
  } catch (e) {
    console.log(e)
    return res.sendStatus(401); // unauthorized
  }
}

router.get("/", verifyVoteAccess, async (req, res) => {
  const meetingId = req.meetingId;
  if (!meetingId) res.sendStatus(400); // bad request
  try {
    const meeting = await Meeting.getMeeting(meetingId);
    if (meeting) {
      res.json({
        ...meeting.toJSON(),
        startDate: JSON.parse(meeting.startDateJSON),
        endDate: JSON.parse(meeting.endDateJSON),
      });
    } else {
      res.sendStatus(400); // bad request
    }
  } catch (e) {
    return res.sendStatus(400); // bad request
  }
});

router.post("/", verifyVoteAccess, async (req, res) => {
  const meetingId = req.meetingId;
  const voterUuid = req.body.voterUuid;
  const timestamps = req.body.timestamps;
  if (!meetingId || !voterUuid || !timestamps) res.sendStatus(400); // bad request
  try {
    const meeting = await Meeting.getMeeting(meetingId);
    if (meeting) {
      let entry = meeting.availabilities.find(
        (item) => item.voterUuid === voterUuid
      );
      if (!entry) {
        entry = { voterUuid, timestamps: [] };
        meeting.availabilities.push(entry)
      }
      entry.timestamps = timestamps
      meeting.markModified('availabilities')
      await meeting.save();
      res.sendStatus(200); // ok
    } else {
      res.sendStatus(400); // bad request
    }
  } catch (e) {
    console.log(e)
    return res.sendStatus(400); // bad request
  }
});

module.exports = router;
