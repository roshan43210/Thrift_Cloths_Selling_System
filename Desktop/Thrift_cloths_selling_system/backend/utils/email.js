import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Verify transporter is ready
    await transporter.verify();
    
    const info = await transporter.sendMail({
      from: `"Thrift Marketplace" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendOTP = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #f97316;">Thrift Marketplace - Email Verification</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 4px; color: #111;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return await sendEmail({ to: email, subject: 'Your OTP Verification Code', html });
};
