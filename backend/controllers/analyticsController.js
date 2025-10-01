const TeamModel = require("../model/teamModel");
const { StatusCodes: codes } = require("http-status-codes");
const EventModel = require("../model/eventModel");

const analyticsController = (req, res) => {
  const { eventId } = req.params;
  if (!eventId) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: "Event ID is required" });
  }
  const getAnalytics = async () => {
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(codes.NOT_FOUND).json({ message: "Event not found" });
    }
    const totalTeamsCount = await TeamModel.countDocuments({ eventId });
    const presentTeamsCount = await TeamModel.countDocuments({
      eventId,
      isPresent: true,
    });
    const absentTeamsCount = totalTeamsCount - presentTeamsCount;

    const totalTeams = await TeamModel.find({ eventId });
    const presentTeams = await TeamModel.find({ eventId, isPresent: true });
    const absentTeams = await TeamModel.find({ eventId, isPresent: false });

    res.status(codes.OK).json({
      event: event.name,
      totalTeamsCount,
      presentTeamsCount,
      absentTeamsCount,
      totalTeams,
      presentTeams,
      absentTeams,
    });
  };
  getAnalytics();
};
module.exports = { analyticsController };
