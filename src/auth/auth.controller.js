const bcyptjs = require("bcryptjs");
const NewUserModel = require("./auth.model");
const jwt = require("jsonwebtoken");

// REGISTER

exports.register = async (req, res, next) => {
  try {
    const { email, subscription, password } = req.body;

    const existingUser = await NewUserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email in use");
    }

    const passwordHash = await bcyptjs.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    await NewUserModel.create({
      email,
      subscription,
      password: passwordHash,
    });

    res.status(201).send({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await NewUserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordCorrect = await bcyptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Email or password is wrong");
    }

    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("token", token, { httpOnly: true });

    await NewUserModel.findByIdAndUpdate(user._id, { token });

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

    const user = await NewUserModel.findById(payload.uid);
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
    await NewUserModel.findByIdAndUpdate(userId, { token: null });

    await res.clearCookie("token");

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
