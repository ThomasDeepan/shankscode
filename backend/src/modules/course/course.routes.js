const express = require("express");
const router = express.Router();
const courseController = require("./course.controller");

// Import your auth security guard
const { protect } = require("../../middlewares/authMiddleware");

// Route 1: COMPLETELY PUBLIC (Anyone can view catalog)
router.get("/", courseController.getAllCourses);

// Route 2: PROTECTED WALL (Throws 401 if not logged in)
// protect() without arguments simply checks if they have a valid token cookie
router.get("/:id", protect(), courseController.getCourseDetails);
router.patch("/:id/progress", protect(), courseController.updateProgress);

// Route 3: ADMIN ONLY (Throws 403 if user is a student)
router.post("/create", protect(["ADMIN"]), courseController.createCourse);

module.exports = router;
