const TeamModel = require("../model/teamModel");
const { StatusCodes: codes } = require("http-status-codes");
const EventModel = require("../model/eventModel");
const jwt = require("jsonwebtoken");

const scannerController = async (req, res) => {
  const { teamId, eventId, token } = req.body;
  const { currentEventId } = req.params;
  if (!teamId || !eventId || !token) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }
  if (eventId !== currentEventId) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: "Event ID does not match current event" });
  }
  const team = await TeamModel.findOne({ _id: teamId, eventId: eventId });
  if (!team) {
    return res.status(codes.NOT_FOUND).json({ message: "Team not found" });
  }
  const event = await EventModel.findById(eventId);
  if (!event) {
    return res.status(codes.NOT_FOUND).json({ message: "Event not found" });
  }
  if (team.isPresent) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: "Team is already marked present" });
  }
  const isValid = jwt.verify(token, process.env.JWT_SECRET);
  if (!isValid) {
    return res.status(codes.UNAUTHORIZED).json({ message: "Invalid token" });
  }
  team.isPresent = true;
  team.presentAt = new Date();
  await team.save();
  res
    .status(codes.OK)
    .json({ message: "Attendance marked successfully", team });
};

module.exports = { scannerController };
