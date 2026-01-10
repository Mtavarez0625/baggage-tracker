const mongoose = require("mongoose");

const bagSchema = new mongoose.Schema(
  {
    tagNumber: { type: String, required: true, unique: true },
    passengerName: { type: String, required: true },
    flightNumber: { type: String, required: true },

    gate: { type: String, default: "" },
    belt: { type: String, default: "" },
    destination: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Checked In", "Loaded", "In Transit", "Delivered"],
      default: "Checked In",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bag", bagSchema);
