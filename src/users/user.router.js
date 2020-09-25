const { Router } = require("express");
const { authorize } = require("../auth/auth.controller");
const {
  getCurrentUser,
  updateSubscription,
  checkSubscriptionOption,
} = require("./user.controller");

const router = Router();

router.get("/current", authorize, getCurrentUser);

router.patch("/", authorize, checkSubscriptionOption, updateSubscription);

exports.userRouter = router;
