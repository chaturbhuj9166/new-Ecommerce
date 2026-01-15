import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.MY_SENDGRID_API_KEY);

export const sendOtpEmail = async (email, otp) => {
  await sgMail.send({
    to: email,
    from: process.env.MY_SENDGRID_EMAIL,
    subject: "Verify your Email - OTP",
    html: `<h2>Your OTP: <b>${otp}</b><br/>Valid for 5 minutes</h2>`,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: process.env.MY_SENDGRID_EMAIL,
    subject: "Welcome 🎉",
    html: `<h2>Welcome ${name}</h2><p>Email verified successfully</p>`,
  });
};
