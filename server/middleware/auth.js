const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware สำหรับตรวจสอบ JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-__v");

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    res.status(500).json({ error: "Server error during authentication." });
  }
};

// Middleware สำหรับตรวจสอบว่า profile สมบูรณ์หรือไม่
const requireCompleteProfile = (req, res, next) => {
  if (!req.user.isProfileComplete) {
    return res.status(403).json({
      error: "Profile incomplete. Please complete your profile first.",
      requiresProfileSetup: true,
    });
  }
  next();
};

module.exports = {
  auth,
  requireCompleteProfile,
};
