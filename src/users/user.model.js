const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
    required: true,
  },
  password: { type: String, required: true },
  avatarURL: { type: String },
  token: { type: String },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
});

const UserModel = mongoose.models.NewUser || mongoose.model("User", userSchema);

module.exports = UserModel;
