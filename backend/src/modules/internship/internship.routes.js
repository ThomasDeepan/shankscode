const express = require("express");
const router = express.Router();
const internshipController = require("./internship.controller");

// First, import the protect security middleware from Day 2
const { protect } = require("../../middlewares/authMiddleware");

// Public route: Students apply here
router.post("/apply", internshipController.applyInternship);

// Protected Admin Route: Only accounts with ADMIN role can pull this array
// (If you haven't written the explicit protect file yet, you can test it openly,
// but we map it here for production-grade security setup)
router.get(
  "/submissions",
  protect(["ADMIN"]),
  internshipController.getAllSubmissions,
);

module.exports = router;
