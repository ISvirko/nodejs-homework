const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (email, verificationToken) => {
  const verificationLink = `http://localhost:${PORT}/auth/verify/${verificationToken}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: "Email verification",
    html: `<a href=${verificationLink}>Please verify your email</a>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendVerificationEmail;
