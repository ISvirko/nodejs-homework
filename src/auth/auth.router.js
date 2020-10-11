const { Router } = require("express");
const {
  register,
  generateAvatar,
  login,
  logout,
  authorize,
  verifyEmail,
} = require("./auth.controller");
const { validator } = require("../helpers/validator");
const { registerScheme, loginScheme } = require("../helpers/authValidSchemes");
const { minifyImage } = require("../users/user.controller");

const router = Router();

router.post(
  "/register",
  validator(registerScheme),
  generateAvatar,
  minifyImage,
  register
);

router.post("/login", validator(loginScheme), login);

router.post("/logout", authorize, logout);

router.get("/verify/:verificationToken", verifyEmail);

exports.authRouter = router;
