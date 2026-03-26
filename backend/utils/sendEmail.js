// import sgMail from "@sendgrid/mail";

// sgMail.setApiKey(process.env.MY_SENDGRID_API_KEY);

// const FROM_SENDER = {
//   email: process.env.MY_SENDGRID_EMAIL,
//   name: "Chaturbhuj Joshi",
// };

// export const sendOtpEmail = async (email, otp) => {
//   await sgMail.send({
//     to: email,
//     from: FROM_SENDER,
//     subject: "Verify your Email - OTP",
//     html: `
//       <h2>Hello 👋</h2>
//       <p>Your OTP is:</p>
//       <h1>${otp}</h1>
//       <p>This OTP is valid for <b>5 minutes</b>.</p>
//       <br/>
//       <p>— Chaturbhuj Joshi</p>
//     `,
//   });
// };

// export const sendWelcomeEmail = async (email, name) => {
//   await sgMail.send({
//     to: email,
//     from: FROM_SENDER,
//     subject: "Welcome 🎉",
//     html: `
//       <h2>Welcome ${name} 🎉</h2>
//       <p>Your email has been verified successfully.</p>
//       <br/>
//       <p>Thanks & Regards,</p>
//       <p><b>Chaturbhuj Joshi</b></p>
//     `,
//   });
// };
