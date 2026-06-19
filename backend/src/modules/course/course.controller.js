const Progress = require("./progress.model");
const Course = require("./course.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

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

exports.updateProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id; // Pulled from our JWT protect middleware token
    const { lessonId } = req.body;

    // 1. Fetch the Target Course to verify total lesson count
    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // 2. Find or Create the user's progress tracking document
    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        completedLessons: [],
      });
    }

    // 3. If the lesson isn't already marked complete, push it into the array
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // 4. Mathematical Evaluation: Check if completed equals total
    if (
      progress.completedLessons.length === course.lessons.length &&
      !progress.isCompleted
    ) {
      progress.isCompleted = true;

      // --- PDF ENGINE ACTIVATION ---
      const doc = new PDFDocument({ size: "A4", layout: "landscape" });
      const filename = `certificate_${userId}_${courseId}.pdf`;
      const absolutePath = path.join(
        __dirname,
        "../../../public/certificates",
        filename,
      );

      const writeStream = fs.createWriteStream(absolutePath);
      doc.pipe(writeStream);

      // Draw clean geometric certificate borders
      doc
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(4)
        .stroke("#4A90E2");
      doc
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(1)
        .stroke("#D0D0D0");

      // Inject Content Branding
      doc.moveDown(4);
      doc
        .fillColor("#333333")
        .fontSize(36)
        .text("CERTIFICATE OF COMPLETION", { align: "center" });
      doc.moveDown(1);
      doc
        .fillColor("#666666")
        .fontSize(16)
        .text(
          "This document proudly certifies that the student matching profile ID:",
          { align: "center" },
        );

      doc.moveDown(1);
      doc
        .fillColor("#2C3E50")
        .fontSize(24)
        .text(`${userId}`, { align: "center", underline: true });

      doc.moveDown(1);
      doc
        .fillColor("#666666")
        .fontSize(16)
        .text(`has successfully finalized all required course modules for:`, {
          align: "center",
        });
      doc.moveDown(0.5);
      doc
        .fillColor("#E74C3C")
        .fontSize(22)
        .text(`"${course.title}"`, { align: "center" });

      doc.moveDown(3);
      doc
        .fillColor("#999999")
        .fontSize(10)
        .text(`Verified securely by EdTech Backend Engine • Year 2026`, {
          align: "center",
        });

      doc.end();

      // Store static path endpoint
      progress.certificateUrl = `/certificates/${filename}`;
    }

    await progress.save();
    res.status(200).json({
      success: true,
      message: progress.isCompleted
        ? "Course complete! Certificate generated."
        : "Progress recorded successfully.",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
