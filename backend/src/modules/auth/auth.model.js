const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["STUDENT", "ADMIN"], default: "STUDENT" },
  },
  { timestamps: true },
); // Automatically creates createdAt and updatedAt fields

module.exports = mongoose.model("User", UserSchema);
