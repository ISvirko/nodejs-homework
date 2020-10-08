const { Router } = require("express");
const { authorize } = require("../auth/auth.controller");
const {
  getCurrentUser,
  updateSubscription,
  checkSubscriptionOption,
  addAvatar,
  minifyImage,
  upload,
} = require("./user.controller");

// ROUTER
const router = Router();

router.get("/current", authorize, getCurrentUser);

router.patch("/", authorize, checkSubscriptionOption, updateSubscription);

router.patch("/avatars", upload, minifyImage, addAvatar);

exports.userRouter = router;
