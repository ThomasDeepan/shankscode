const express = require("express");
const router = express.Router();
const blogController = require("./blog.controller");
const { protect } = require("../../middlewares/authMiddleware");

router.post("/create", protect(["ADMIN"]), blogController.createBlog);
router.get("/:slug", blogController.getBlogBySlug);

module.exports = router;
