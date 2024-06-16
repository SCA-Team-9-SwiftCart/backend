const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// not necessary important but helps in debugging email functionality
transporter.verify((error) => {
  if (error) {
    console.log('there is an error: ', error)
  } else {
    console.log('ready...')
  }
})

const sendVerificationEmail = (email, token, userId) => {
  const verificationUrl = `https://swiftcard-app.onrender.com/api/verify-email?${userId}`; 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking on the following link:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>.
           <p>Enter your OTP code ${token} to complete your verification.<p>
          `,
  };

  return transporter.sendMail(mailOptions); 
};

module.exports = sendVerificationEmail;
