const jwt = require("jsonwebtoken");

const protect = (roles = []) => {
  return (req, res, next) => {
    // Look for the token in cookies or the standard Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied: Log in to proceed." });
    }

    try {
      // Verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Contains user ID and role

      // If a specific role is required (like ADMIN) and user doesn't match, block them
      if (roles.length && !roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Admin access only." });
      }

      next(); // Keep moving to the controller
    } catch (error) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid or expired authentication token.",
        });
    }
  };
};

module.exports = { protect };
