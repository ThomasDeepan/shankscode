const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true }, // URL path to image
    lessons: [
      {
        lessonId: { type: String, required: true },
        title: { type: String, required: true },
        youtubeEmbedId: { type: String, required: true }, // Just the ID like 'dQw4w9WgXcQ'
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", CourseSchema);
