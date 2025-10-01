const mongoose = require("mongoose");
const validator = require("validator");

const TeamSchema = new mongoose.Schema({
  leaderName: { type: String, required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  email: {
    type: String,
    required: true,
    validators: [validator.isEmail, "Please provide a valid email"],
  },
  department: { type: String, required: true },
  year: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  teamName: { type: String, required: true },

  // QR details
  qrToken: { type: String },
  qrImageUrl: { type: String },

  // Attendance
  isPresent: { type: Boolean, default: false },
  presentAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

TeamSchema.index({ eventId: 1, teamName: 1 }, { unique: true });

module.exports = mongoose.model("Team", TeamSchema);
