const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
    required: true,
  },
});

const CurrentUserModel =
  mongoose.models.NewUser || mongoose.model("CurrentUser", userSchema);

module.exports = CurrentUserModel;
