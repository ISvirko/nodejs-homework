const bcyptjs = require("bcryptjs");
const UserModel = require("../users/user.model");
const jwt = require("jsonwebtoken");
const Avatar = require("avatar-builder");
const fs = require("fs");
const uuid = require("uuid");
const sendVerificationEmail = require("../helpers/sendVerificationEmail");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// GENERATE AVATAR

exports.generateAvatar = async (req, res, next) => {
  try {
    const catAvatar = Avatar.catBuilder(256);
    const filename = Date.now() + ".png";
    const destination = "tmp";

    const avatar = await catAvatar.create(filename);

    await fs.writeFileSync(`${destination}/${filename}`, avatar);

    req.file = { destination, filename };
    next();
  } catch (error) {
    next(error);
  }
};

// VERIFY EMAIL

exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await UserModel.findOne({ verificationToken });

    if (!user) {
      return res.status(404).send("User not found");
    }

    await UserModel.findOneAndUpdate(
      { verificationToken },
      { isVerified: true, verificationToken: "" }
    );

    return res.status(200).send("Email verified successfully");
  } catch (error) {
    next(error);
  }
};

// REGISTER

exports.register = async (req, res, next) => {
  try {
    const { email, subscription, password } = req.body;
    const { filename } = req.file;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Email in use");
    } else {
      const passwordHash = await bcyptjs.hash(
        password,
        Number(process.env.BCRYPT_SALT_ROUNDS)
      );

      const verificationToken = uuid.v4();

      const newUser = await UserModel.create({
        email,
        subscription,
        password: passwordHash,
        avatarURL: `http://locahost:${PORT}/images/${filename}`,
        verificationToken,
      });

      await sendVerificationEmail(email, verificationToken);

      if (newUser) {
        res.status(201).send({
          id: newUser._id,
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// LOGIN

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send("User not found");
    }

    const isPasswordCorrect = await bcyptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Email or password is wrong");
    }

    if (!user.isVerified) {
      return res.status(403).send("Email is not verified");
    }

    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600 * 24,
      sameSite: "strict",
    });

    await UserModel.findByIdAndUpdate(user._id, { token });

    res.status(200).send({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// AUTHORIZE

exports.authorize = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    let payload;
    try {
      payload = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).send("Not authorized");
    }

    const user = await UserModel.findById(payload.uid);
    if (!user) {
      return res.status(401).send("Not authorized");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

// LOGOUT

exports.logout = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    await UserModel.findByIdAndUpdate(userId, { token: null });

    await res.clearCookie("token");

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
