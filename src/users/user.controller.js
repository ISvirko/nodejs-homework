const CurrentUserModel = require("./user.model");
const path = require("path");
const multer = require("multer");
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

const storage = multer.diskStorage({
  destination: "./tmp",
  filename: (req, file, cb) => {
    const { ext } = path.parse(file.originalname);
    return cb(null, Date.now() + ext);
  },
});

exports.upload = multer({ storage }).single("avatarURL");

exports.addAvatar = (req, res, next) => {
  return res.status(200).send(req.file);
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

    next();
  } catch (error) {
    next(error);
  }
};
