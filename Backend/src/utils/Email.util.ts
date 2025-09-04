import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or smtp host like smtp.mailtrap.io
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password / smtp password
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "",
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err; // rethrow so service layer can handle
  }
}
