const { Router } = require("express");
const { authorize } = require("../auth/auth.controller");
const multer = require("../helpers/multer");
const {
  getCurrentUser,
  updateSubscription,
  checkSubscriptionOption,
  minifyImage,
  updateAvatar,
} = require("./user.controller");

// ROUTER
const router = Router();

router.get("/current", authorize, getCurrentUser);

router.patch("/", authorize, checkSubscriptionOption, updateSubscription);

router.patch("/avatars", authorize, multer, minifyImage, updateAvatar);

exports.userRouter = router;
