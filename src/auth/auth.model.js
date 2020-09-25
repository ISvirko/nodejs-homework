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
  token: { type: String },
});

const NewUserModel =
  mongoose.models.NewUser || mongoose.model("NewUser", userSchema);

module.exports = NewUserModel;
