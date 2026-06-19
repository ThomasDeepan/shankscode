const Course = require("./course.model");

// 1. PUBLIC: Fetch all courses (Only shows basic cards)
exports.getAllCourses = async (req, res) => {
  try {
    // Fetch only title, description, and thumbnail, exclude lesson content for unauthenticated users
    const courses = await Course.find({}, "title description thumbnail");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. PRIVATE: Fetch deep details including video embed strings (Requires Auth)
exports.getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    res.status(200).json({
      success: true,
      message: "Access Authorized. Lesson metadata unlocked.",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. ADMIN ONLY: Create a new course
exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
