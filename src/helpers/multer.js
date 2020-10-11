const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const { ext } = path.parse(file.originalname);

    filename = String(Date.now()) + ext;
    return cb(null, filename);
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "image/png" || file.mimetype !== "image/jpeg") {
      return cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

module.exports = multer({ storage }).single("avatarURL");
