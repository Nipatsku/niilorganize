const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const MeetingSchema = mongoose.Schema({
  name: { type: String, required: true },
  organizer: { type: String, required: true },
  startDateJSON: { type: String, required: true },
  endDateJSON: { type: String, required: true },
  inviteCount: { type: Number, required: true },
  invite: { type: String, required: false },
  availabilities: { type: [{}], required: true }
});

const Meeting = mongoose.model("Meeting", MeetingSchema);
module.exports = Meeting;

module.exports.getOrganizerMeetings = async (organizer) => {
  const meetings = await Meeting.find({});
  return meetings.filter((meeting) => meeting.organizer === organizer);
};

module.exports.createMeeting = async (data) => {
  try {
    const { organizer, name, startDate, endDate, inviteCount } = data;
    const startDateJSON = JSON.stringify(startDate)
    const endDateJSON = JSON.stringify(endDate)
    // Create Meeting data base entry before invite link, because invite needs ID to the Meeting
    const newMeeting = new Meeting({
      name,
      organizer,
      startDateJSON,
      endDateJSON,
      inviteCount,
      availabilities: []
    });
    await newMeeting.save();
    // Generate invite link. This is a JWT auth token without admin access, that is also linked to the particular meeting
    const inviteToken = await jwt.sign({ meetingId: newMeeting._id.toString() }, config.secret);
    newMeeting.invite = `${config.address}/vote/${inviteToken}`;
    await newMeeting.save();
    return newMeeting;
  } catch (e) {
    return false;
  }
};

module.exports.getMeeting = (meetingId) => {
  return Meeting.findById(meetingId)
}

module.exports.deleteMeeting = (meetingId) => {
  return Meeting.deleteOne({ _id: meetingId })
}
