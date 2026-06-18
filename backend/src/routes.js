const express = require("express");
const router = express.Router();

// Import individual module routes
const courseRoutes = require("./modules/course/course.routes");

// Mount them to specific endpoints
router.use("/courses", courseRoutes);

module.exports = router;
