const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["promptpay", "bank", "qr_code"],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: function () {
      return this.type === "bank";
    },
  },
  accountName: {
    type: String,
  },
  bankIcon: String,
  qrCodeUrl: {
    type: String,
    required: function () {
      return this.type === "qr_code";
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const socialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ["instagram", "facebook", "twitter"],
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    lineId: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    pictureUrl: String,
    email: String,

    // Payment Methods
    paymentMethods: [paymentMethodSchema],

    // Contact Info
    phoneNumber: String,
    socialMedia: [socialMediaSchema],

    // Groups reference
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to ensure only one default payment method
userSchema.pre("save", function (next) {
  if (this.paymentMethods && this.paymentMethods.length > 0) {
    const defaultMethods = this.paymentMethods.filter(
      (method) => method.isDefault
    );
    if (defaultMethods.length > 1) {
      // Keep only the first default, set others to false
      this.paymentMethods.forEach((method, index) => {
        if (index > 0 && method.isDefault) {
          method.isDefault = false;
        }
      });
    }
  }
  next();
});

// Virtual for checking if user can join more groups
userSchema.virtual("canJoinMoreGroups").get(function () {
  return this.groups.length < 5;
});

// Method to add user to group
userSchema.methods.addToGroup = function (groupId) {
  if (this.canJoinMoreGroups && !this.groups.includes(groupId)) {
    this.groups.push(groupId);
    return true;
  }
  return false;
};

// Method to remove user from group
userSchema.methods.removeFromGroup = function (groupId) {
  this.groups = this.groups.filter((id) => !id.equals(groupId));
  return this.save();
};

// Method to check if profile is complete
userSchema.methods.checkProfileComplete = function () {
  const hasPaymentMethod =
    this.paymentMethods && this.paymentMethods.length > 0;
  const hasBasicInfo = this.displayName && this.lineId;

  this.isProfileComplete = hasBasicInfo && hasPaymentMethod;
  return this.isProfileComplete;
};

module.exports = mongoose.model("User", userSchema);
