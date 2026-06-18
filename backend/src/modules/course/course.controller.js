// Test logic to make sure the course routing works
exports.getTestCourses = (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Hello from the Course Module! Routing pipeline is officially working.",
  });
};
