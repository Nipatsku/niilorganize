const express = require("express");
const Meeting = require("../models/meeting");
const verifyToken = require("../verify-admin");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const organizer = req.organizer;
  if (!organizer) res.sendStatus(400); // bad request
  // Get all meetings of the authenticator
  let meetings = await Meeting.getOrganizerMeetings(organizer);
  meetings = meetings.map((meeting) => ({
    ...meeting.toJSON(),
    startDate: JSON.parse(meeting.startDateJSON),
    endDate: JSON.parse(meeting.endDateJSON),
  }));
  res.json(meetings);
});

router.post("/", verifyToken, async (req, res) => {
  const organizer = req.organizer;
  if (!organizer) res.sendStatus(400); // bad request
  const newMeeting = await Meeting.createMeeting({ ...req.body, organizer });
  if (newMeeting) {
    res.json(newMeeting);
  } else {
    res.sendStatus(400); // bad request
  }
});

router.delete("/", verifyToken, async (req, res) => {
  const meetingId = req.body.meetingId
  if (!meetingId) res.sendStatus(400); // bad request
  try {
    await Meeting.deleteMeeting(meetingId)
    res.sendStatus(200) // ok
  } catch (e) {
    res.sendStatus(400); // bad request
  }
});

module.exports = router;
