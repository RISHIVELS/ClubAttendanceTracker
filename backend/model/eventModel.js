const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: { type: Date, required: true },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  clubName: { type: String, required: true },
  description: { type: String, required: true },
  eventHead: { type: String, required: true },
});

module.exports = mongoose.model("Event", EventSchema);
