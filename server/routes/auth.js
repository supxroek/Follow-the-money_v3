const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// LINE Login callback - รับ access token จาก LINE
router.post("/line-login", async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    // ตรวจสอบ access token กับ LINE API
    const lineResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const lineProfile = lineResponse.data;

    // ค้นหาหรือสร้างผู้ใช้ใหม่
    let user = await User.findOne({ lineId: lineProfile.userId });

    if (!user) {
      // สร้างผู้ใช้ใหม่
      user = new User({
        lineId: lineProfile.userId,
        displayName: lineProfile.displayName,
        pictureUrl: lineProfile.pictureUrl || "",
        isProfileComplete: false,
      });
      await user.save();
    } else {
      // อัพเดทข้อมูลล่าสุดจาก LINE
      user.displayName = lineProfile.displayName;
      user.pictureUrl = lineProfile.pictureUrl || "";
      await user.save();
    }

    // สร้าง JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        lineId: user.lineId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("LINE Login error:", error);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Invalid LINE access token" });
    }

    res.status(500).json({ error: "Login failed" });
  }
});

// ตรวจสอบสถานะการ login
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("groups", "groupName groupCode memberCount")
      .select("-__v");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Failed to get user profile" });
  }
});

// อัพเดท profile ผู้ใช้
router.put("/profile", auth, async (req, res) => {
  try {
    const { phoneNumber, socialMedia, paymentMethods } = req.body;

    const user = await User.findById(req.user._id);

    // อัพเดทข้อมูล
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (socialMedia !== undefined) user.socialMedia = socialMedia;
    if (paymentMethods !== undefined) user.paymentMethods = paymentMethods;

    // ตรวจสอบความสมบูรณ์ของ profile
    user.checkProfileComplete();

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl,
        phoneNumber: user.phoneNumber,
        socialMedia: user.socialMedia,
        paymentMethods: user.paymentMethods,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// เพิ่ม payment method
router.post("/payment-method", auth, async (req, res) => {
  try {
    const { type, value, bankName, bankIcon, qrCodeUrl, isDefault } = req.body;

    if (!type || !value) {
      return res.status(400).json({ error: "Type and value are required" });
    }

    const user = await User.findById(req.user._id);

    await user.addPaymentMethod({
      type,
      value,
      bankName,
      bankIcon,
      qrCodeUrl,
      isDefault: isDefault || false,
    });

    res.json({
      success: true,
      message: "Payment method added successfully",
      paymentMethods: user.paymentMethods,
    });
  } catch (error) {
    console.error("Add payment method error:", error);
    res.status(500).json({ error: "Failed to add payment method" });
  }
});

module.exports = router;
