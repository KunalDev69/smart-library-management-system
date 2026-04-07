const nodemailer = require("nodemailer");

// Create Nodemailer transporter using Gmail SMTP
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Email message options
  const mailOptions = {
    from: `Smart Library <${process.env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
