import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: '"LuminaAI" <noreply@luminaai.com>',
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your account and claim your 15 credits.</p>`,
  });
};
