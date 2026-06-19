const User = require("./auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. SIGNUP LOGIC
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Encrypt/Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user to MongoDB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "STUDENT", // Defaults to STUDENT if not specified
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. LOGIN LOGIC
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare plain password with hashed database password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create a JWT payload token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }, // Expires in 2 days
    );

    // Send token to frontend inside a secure, HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents frontend JavaScript from accessing the cookie (Protects from XSS attacks)
      secure: true, // Set to true in production when using HTTPS
      maxAge: 48 * 60 * 60 * 1000, // 2 days in milliseconds
    });

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
