const express = require("express");
const router = express.Router();

// Import individual module routes
const courseRoutes = require("./modules/course/course.routes");
const authRoutes = require("./modules/auth/auth.routes");
const internshipRoutes = require("./modules/internship/internship.routes");
const blogRoutes = require("./modules/blog/blog.routes"); // <-- Import
const workshopRoutes = require("./modules/workshop/workshop.routes");

// Mount them to specific endpoints
router.use("/courses", courseRoutes);
router.use("/auth", authRoutes);
router.use("/internships", internshipRoutes);
router.use("/blogs", blogRoutes); // <-- Mount
router.use("/workshops", workshopRoutes);

module.exports = router;
