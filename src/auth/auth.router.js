const { Router } = require("express");
const { register, login, logout, authorize } = require("./auth.controller");
const { validator } = require("../helpers/validator");
const { registerScheme, loginScheme } = require("../helpers/authValidSchemes");

const router = Router();

router.post("/register", validator(registerScheme), register);

router.post("/login", validator(loginScheme), login);

router.post("/logout", authorize, logout);

exports.authRouter = router;
