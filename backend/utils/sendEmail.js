const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  console.log("Sending email to:", options.email, "via Gmail SMTP");

  const info = await transporter.sendMail({
    from: `Smart Library <${process.env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  });

  console.log("Email sent:", info.messageId);
};

module.exports = sendEmail;
