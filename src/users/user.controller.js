const CurrentUserModel = require("./user.model");
const path = require("path");
const { promises: fsPromises } = require("fs");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

exports.getCurrentUser = (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(201).send({ email, subscription });
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { email } = req.user;

    const updatedUserSubsc = await CurrentUserModel.findOneAndUpdate(
      { email },
      req.body,
      { new: true }
    );

    return res.status(200).send(updatedUserSubsc);
  } catch (error) {
    next(error);
  }
};

exports.checkSubscriptionOption = async (req, res, next) => {
  const { subscription } = req.body;

  const options = CurrentUserModel.schema.path("subscription").enumValues;

  if (!options.find((option) => option === subscription)) {
    return res.status(404).send("Invalid subscription option");
  }

  next();
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const { _id, avatarURL } = req.user;

    await CurrentUserModel.findByIdAndUpdate(_id, { avatarURL });

    return res.status(200).send({ avatarURL });
  } catch (error) {
    next(error);
  }
};

exports.minifyImage = async (req, res, next) => {
  try {
    const MINIFIED_IMG_DIR = "public/images";
    const { destination, filename } = req.file;

    await imagemin([`${destination}/${filename}`], {
      destination: MINIFIED_IMG_DIR,
      plugins: [
        imageminJpegtran({
          quality: [0.6, 0.8],
        }),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    req.file = {
      ...req.file,
      path: path.join(MINIFIED_IMG_DIR, filename),
      destination: MINIFIED_IMG_DIR,
    };

    await fsPromises.unlink(`${destination}/${filename}`);

    next();
  } catch (error) {
    next(error);
  }
};
