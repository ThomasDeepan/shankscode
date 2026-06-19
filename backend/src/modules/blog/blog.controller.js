const Blog = require("./blog.model");

// 1. ADMIN ONLY: Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Transform "Hello World 2026!" -> "hello-world-2026"
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newBlog = await Blog.create({ title, content, slug });
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 2. PUBLIC: Fetch single blog by its dynamic URL slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog post not found." });

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
