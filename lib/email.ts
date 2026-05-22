import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: `"Tari Code" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Tari Account Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">Tari Account Verification</h2>
        <p>Hello,</p>
        <p>Thank you for signing up for a Tari account. To complete your registration, please use the following One-Time Password (OTP):</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #4f46e5; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>The Tari Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error };
  }
}
