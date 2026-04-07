const nodemailer = require("nodemailer");

// Create Nodemailer transporter using Gmail SMTP
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  // Email message options
  const mailOptions = {
    from: `Smart Library <${process.env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  console.log("Sending email to:", options.email);
  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);
};

module.exports = sendEmail;
