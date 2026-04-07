const { Resend } = require("resend");

const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("Sending email to:", options.email, "via Resend");

  const { data, error } = await resend.emails.send({
    from: `Smart Library <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data.id);
};

module.exports = sendEmail;
