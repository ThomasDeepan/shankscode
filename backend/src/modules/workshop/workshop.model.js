const mongoose = require("mongoose");

const WorkshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtubeEmbedId: { type: String, required: true }, // Intro video
    price: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workshop", WorkshopSchema);
