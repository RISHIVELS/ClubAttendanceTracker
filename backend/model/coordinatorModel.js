const mongoose = require("mongoose");
const validator = require("validator");

const CoordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validators: [validator.isEmail, "Please provide a valid email"],
  },
  phoneNumber: { type: String, required: true },
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  year: { type: String, required: true },
});

CoordinatorSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Coordinator", CoordinatorSchema);
