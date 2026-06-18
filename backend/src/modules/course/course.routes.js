const express = require("express");
const router = express.Router();
const courseController = require("./course.controller");

// This matches: GET /api/v1/courses/test
router.get("/test", courseController.getTestCourses);

module.exports = router;
