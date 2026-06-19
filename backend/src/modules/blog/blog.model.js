const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // e.g., "my-first-blog"
    content: { type: String, required: true },
    author: { type: String, default: "Admin" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", BlogSchema);
