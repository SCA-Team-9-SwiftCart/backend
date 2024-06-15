const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = (email, token) => {
  const verificationUrl = `https://swiftcard-app.onrender.com/api/verify-email?token=${token}`; 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking on the following link:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
