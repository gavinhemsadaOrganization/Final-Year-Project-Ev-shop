import nodemailer from "nodemailer";

const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

export const sendOtpEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  try{
    const transporter = nodemailer.createTransport({
      host: host,
      port: Number(port) || 587,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
    });

    await transporter.verify();
    const info = await transporter.sendMail({
      from: `"EV-Shop No Reply" <no.reply.electoVolte@gmail.com>`,
      to,
      subject: subject,
      text: text,
      html: html,
    });
    return info;
  }catch(err){
    console.log(err);
  }
};
