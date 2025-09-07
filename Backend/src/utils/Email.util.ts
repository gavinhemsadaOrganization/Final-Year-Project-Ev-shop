import nodemailer from "nodemailer";

export const sendOtpEmail = async (to: string, otp: number, subject: string, text: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();

  return transporter.sendMail({
    from: `"No Reply" <no-reply@example.com>`,
    to,
    subject: subject,
    text: text,
    html: html,
  });
}
