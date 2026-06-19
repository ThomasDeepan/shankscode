const express = require("express");
const router = express.Router();

// Import individual module routes
const courseRoutes = require("./modules/course/course.routes");
const authRoutes = require("./modules/auth/auth.routes");
const internshipRoutes = require("./modules/internship/internship.routes");

// Mount them to specific endpoints
router.use("/courses", courseRoutes);
router.use("/auth", authRoutes);
router.use("/internships", internshipRoutes);

module.exports = router;
