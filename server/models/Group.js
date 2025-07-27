const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    groupCode: {
      type: String,
      unique: true,
      required: true,
      length: 6,
    },
    description: {
      type: String,
      maxlength: 200,
      default: "",
    },

    members: [memberSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// สร้าง group code อัตโนมัติ
groupSchema.pre("save", function (next) {
  if (this.isNew && !this.groupCode) {
    this.groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Method เพื่อเพิ่มสมาชิก
groupSchema.methods.addMember = function (userId, role = "member") {
  // ตรวจสอบว่ามีสมาชิกนี้อยู่แล้วหรือไม่
  const existingMember = this.members.find((member) =>
    member.userId.equals(userId)
  );

  if (existingMember) {
    return false; // สมาชิกมีอยู่แล้ว
  }

  this.members.push({
    userId: userId,
    role: role,
  });

  return true;
};

// Method เพื่อลบสมาชิก
groupSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter((member) => !member.userId.equals(userId));
  return this.save();
};

// Method เพื่อเปลี่ยน role ของสมาชิก
groupSchema.methods.updateMemberRole = function (userId, newRole) {
  const member = this.members.find((member) => member.userId.equals(userId));

  if (member) {
    member.role = newRole;
    return true;
  }
  return false;
};

// Method เพื่อตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
groupSchema.methods.isAdmin = function (userId) {
  const member = this.members.find((member) => member.userId.equals(userId));
  return member && member.role === "admin";
};

// Method เพื่อตรวจสอบว่าผู้ใช้เป็นสมาชิกหรือไม่
groupSchema.methods.isMember = function (userId) {
  return this.members.some((member) => member.userId.equals(userId));
};

// Virtual สำหรับนับจำนวนสมาชิก
groupSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

module.exports = mongoose.model("Group", groupSchema);
