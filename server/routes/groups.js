const express = require("express");
const Group = require("../models/Group");
const User = require("../models/User");
const { auth, requireCompleteProfile } = require("../middleware/auth");

const router = express.Router();

// สร้างกลุ่มใหม่
router.post("/create", auth, requireCompleteProfile, async (req, res) => {
  try {
    const { groupName, description } = req.body;

    if (!groupName) {
      return res.status(400).json({ error: "Group name is required" });
    }

    // ตรวจสอบว่าผู้ใช้มีกลุ่มครบ 5 แล้วหรือไม่
    const user = await User.findById(req.user._id);
    if (user.groups.length >= 5) {
      return res.status(400).json({
        error: "Cannot create more groups. Maximum 5 groups per user.",
      });
    }

    // สร้าง group code แบบสุ่ม
    let groupCode;
    let isUnique = false;

    while (!isUnique) {
      groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingGroup = await Group.findOne({ groupCode });
      if (!existingGroup) {
        isUnique = true;
      }
    }

    // สร้างกลุ่มใหม่
    const newGroup = new Group({
      groupName: groupName.trim(),
      description: description?.trim() || "",
      groupCode,
      createdBy: req.user._id,
      members: [
        {
          userId: req.user._id,
          role: "admin",
        },
      ],
    });

    await newGroup.save();

    // เพิ่มกลุ่มให้ผู้ใช้
    user.groups.push(newGroup._id);
    await user.save();

    await newGroup.populate("members.userId", "displayName pictureUrl");

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// เข้าร่วมกลุ่มด้วยรหัส
router.post("/join", auth, requireCompleteProfile, async (req, res) => {
  try {
    const { groupCode } = req.body;

    if (!groupCode) {
      return res.status(400).json({ error: "Group code is required" });
    }

    const user = await User.findById(req.user._id);

    // ตรวจสอบว่าผู้ใช้มีกลุ่มครบ 5 แล้วหรือไม่
    if (user.groups.length >= 5) {
      return res.status(400).json({
        error: "Cannot join more groups. Maximum 5 groups per user.",
      });
    }

    // ค้นหากลุ่ม
    const group = await Group.findOne({
      groupCode: groupCode.toUpperCase(),
      isActive: true,
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found or inactive" });
    }

    // ตรวจสอบว่าผู้ใช้เป็นสมาชิกอยู่แล้วหรือไม่
    if (group.isMember(req.user._id)) {
      return res
        .status(400)
        .json({ error: "You are already a member of this group" });
    }

    // เพิ่มสมาชิกใหม่
    group.addMember(req.user._id, "member");
    await group.save();

    // เพิ่มกลุ่มให้ผู้ใช้
    user.groups.push(group._id);
    await user.save();

    await group.populate("members.userId", "displayName pictureUrl");

    res.json({
      success: true,
      message: `Successfully joined group: ${group.groupName}`,
      group,
    });
  } catch (error) {
    console.error("Join group error:", error);
    res.status(500).json({ error: "Failed to join group" });
  }
});

// ดูกลุ่มทั้งหมดของผู้ใช้
router.get("/my-groups", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "groups",
      match: { isActive: true },
      populate: {
        path: "members.userId",
        select: "displayName pictureUrl",
      },
    });

    res.json({
      success: true,
      groups: user.groups || [],
    });
  } catch (error) {
    console.error("Get user groups error:", error);
    res.status(500).json({ error: "Failed to get groups" });
  }
});

// ดูรายละเอียดกลุ่ม
router.get("/:groupId", auth, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("members.userId", "displayName pictureUrl phoneNumber")
      .populate("createdBy", "displayName pictureUrl");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // ตรวจสอบว่าผู้ใช้เป็นสมาชิกหรือไม่
    if (!group.isMember(req.user._id)) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a member of this group." });
    }

    res.json({
      success: true,
      group,
    });
  } catch (error) {
    console.error("Get group details error:", error);
    res.status(500).json({ error: "Failed to get group details" });
  }
});

// ออกจากกลุ่ม
router.post("/:groupId/leave", auth, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // ตรวจสอบว่าผู้ใช้เป็นสมาชิกหรือไม่
    if (!group.isMember(req.user._id)) {
      return res
        .status(400)
        .json({ error: "You are not a member of this group" });
    }

    // ไม่ให้ admin คนสุดท้ายออกจากกลุ่ม
    const admins = group.members.filter((member) => member.role === "admin");
    const isLastAdmin = admins.length === 1 && group.isAdmin(req.user._id);

    if (isLastAdmin) {
      return res.status(400).json({
        error:
          "Cannot leave group. You are the last admin. Please transfer admin role first.",
      });
    }

    // ลบผู้ใช้จากกลุ่ม
    await group.removeMember(req.user._id);

    // ลบกลุ่มจากผู้ใช้
    const user = await User.findById(req.user._id);
    await user.removeFromGroup(groupId);

    res.json({
      success: true,
      message: `Successfully left group: ${group.groupName}`,
    });
  } catch (error) {
    console.error("Leave group error:", error);
    res.status(500).json({ error: "Failed to leave group" });
  }
});

// เปลี่ยน role สมาชิก (admin เท่านั้น)
router.put("/:groupId/members/:memberId/role", auth, async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be admin or member." });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
    if (!group.isAdmin(req.user._id)) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required." });
    }

    // อัพเดท role
    const updated = group.updateMemberRole(memberId, role);
    if (!updated) {
      return res.status(404).json({ error: "Member not found in group" });
    }

    await group.save();
    await group.populate("members.userId", "displayName pictureUrl");

    res.json({
      success: true,
      message: "Member role updated successfully",
      group,
    });
  } catch (error) {
    console.error("Update member role error:", error);
    res.status(500).json({ error: "Failed to update member role" });
  }
});

module.exports = router;
