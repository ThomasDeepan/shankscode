const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [{ type: String }], // Array of strings holding lessonIds (e.g., ["L1", "L2"])
    isCompleted: { type: Boolean, default: false },
    certificateUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

// Prevent duplicate tracking profiles: Ensure a user only has exactly ONE progress document per course
ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", ProgressSchema);
