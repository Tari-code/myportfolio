import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const transporter = getTransporter();

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);
    return false;
  }
  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#030303;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#030303;padding:40px 20px;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0a0c;border:1px solid rgba(255,255,255,0.12);border-radius:24px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#6366f1,#818cf8);padding:32px;text-align:center;">
                <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;">Tari Technologies</div>
                <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:4px;">Password Reset Request</div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 32px;">
                <p style="color:#fefefe;font-size:16px;line-height:1.6;margin:0 0 16px;">Hi there,</p>
                <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;margin:0 0 32px;">
                  We received a request to reset your password. Click the button below to choose a new one.
                  This link expires in <strong style="color:#fefefe;">1 hour</strong>.
                </p>
                <div style="text-align:center;margin-bottom:32px;">
                  <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 40px;border-radius:14px;">
                    Reset My Password →
                  </a>
                </div>
                <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 8px;">Or copy this link into your browser:</p>
                <p style="color:rgba(255,255,255,0.3);font-size:12px;word-break:break-all;margin:0;">${resetUrl}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
                <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">© ${new Date().getFullYear()} Tari Technologies. If you didn't request this, ignore this email.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body></html>`;
  try {
    await transporter.sendMail({
      from: `"Tari Technologies" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset your Tari Technologies password",
      html,
    });
    return true;
  } catch (err) {
    console.error("Password reset email error:", err);
    return false;
  }
}

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
