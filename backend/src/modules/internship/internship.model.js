const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    degree: { type: String, required: true },
    department: { type: String, required: true },
    college: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String }, // Optional field
  },
  { timestamps: true },
);

module.exports = mongoose.model("Internship", InternshipSchema);
