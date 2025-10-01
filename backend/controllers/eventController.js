const EventModel = require("../model/eventModel");
const TeamModel = require("../model/teamModel");
const { StatusCodes: codes } = require("http-status-codes");

// Create a new event

const createEvent = async (req, res) => {
  const { name, date, location, description, clubName, eventHead } = req.body;
  if (!name || !date || !location || !description || !clubName || !eventHead) {
    return res
      .status(codes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }
  const event = await EventModel.create({
    name,
    date,
    location,
    description,
    clubName,
    eventHead,
  });
  res.status(codes.CREATED).json({ event });
};

const getAllEvents = async (req, res) => {
  const events = await EventModel.find({});
  res.status(codes.OK).json({ events, count: events.length });
};

const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  const event = await EventModel.findById(id);
  if (!event) {
    return res.status(codes.NOT_FOUND).json({ message: "Event not found" });
  }
  const teams = await TeamModel.find({ eventId: id });

  res.status(codes.OK).json({ event, teams, teamsCount: teams.length });
};

module.exports = {
  createEvent,
  getAllEvents,
  getSingleEvent,
};
