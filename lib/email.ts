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

const BRAND_GRADIENT = "linear-gradient(135deg,#6366f1,#818cf8)";
const BRAND_ORANGE = "#f97316";

function emailWrapper(title: string, content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#030303;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#030303;padding:40px 20px;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0a0c;border:1px solid rgba(255,255,255,0.12);border-radius:24px;overflow:hidden;max-width:560px;width:100%;">
          <tr>
            <td style="background:${BRAND_GRADIENT};padding:28px 32px;text-align:center;">
              <div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-1px;">Tari Technologies</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">${title}</div>
            </td>
          </tr>
          <tr><td style="padding:36px 32px;">${content}</td></tr>
          <tr>
            <td style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
              <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">© ${new Date().getFullYear()} Tari Technologies · Automated Notification System</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);
    return false;
  }
  const html = emailWrapper("Password Reset Request", `
    <p style="color:#fefefe;font-size:16px;line-height:1.6;margin:0 0 16px;">Hi there,</p>
    <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;margin:0 0 32px;">
      We received a request to reset your password. Click the button below to choose a new one.
      This link expires in <strong style="color:#fefefe;">1 hour</strong>.
    </p>
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${resetUrl}" style="display:inline-block;background:${BRAND_GRADIENT};color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 40px;border-radius:14px;">
        Reset My Password →
      </a>
    </div>
    <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 8px;">Or copy this link:</p>
    <p style="color:rgba(255,255,255,0.3);font-size:12px;word-break:break-all;margin:0;">${resetUrl}</p>
  `);
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
  const html = emailWrapper("Account Verification", `
    <p style="color:#fefefe;font-size:16px;margin:0 0 12px;">Hello,</p>
    <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;margin:0 0 24px;">
      Thank you for joining Tari Technologies. Use this OTP to verify your account:
    </p>
    <div style="background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
      <div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#818cf8;">${otp}</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:8px;">Valid for 10 minutes</div>
    </div>
    <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">If you did not request this, please ignore this email.</p>
  `);
  try {
    await transporter.sendMail({
      from: `"Tari Code" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Tari Account Verification",
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error };
  }
}

export async function sendAdminNewUserAlert(userName: string, userEmail: string, userTier: string = "free"): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Admin alert: New user registered — ${userName} (${userEmail})`);
    return;
  }
  const html = emailWrapper("⚡ New User Registration", `
    <div style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.25);border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:${BRAND_ORANGE};text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">NEW MEMBER JOINED</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Name</td><td style="color:#fff;font-size:13px;font-weight:700;padding:6px 0;text-align:right;">${userName}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Email</td><td style="color:#818cf8;font-size:13px;font-weight:700;padding:6px 0;text-align:right;">${userEmail}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Tier</td><td style="color:${BRAND_ORANGE};font-size:13px;font-weight:700;padding:6px 0;text-align:right;text-transform:uppercase;">${userTier}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Time</td><td style="color:rgba(255,255,255,0.6);font-size:13px;padding:6px 0;text-align:right;">${new Date().toUTCString()}</td></tr>
      </table>
    </div>
    <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Log in to your admin panel to manage this user's account and tier.</p>
  `);
  try {
    await transporter.sendMail({
      from: `"Tari Alert System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `⚡ New User: ${userName} just registered on Tari`,
      html,
    });
  } catch (err) {
    console.error("Admin new user alert error:", err);
  }
}

export async function sendAdminNewTicketAlert(userName: string, userEmail: string, message: string): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Admin alert: New ticket from ${userName} (${userEmail})`);
    return;
  }
  const truncated = message.length > 300 ? message.slice(0, 300) + "..." : message;
  const html = emailWrapper("🎫 New Support Ticket", `
    <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">TICKET SUBMITTED</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">From</td><td style="color:#fff;font-size:13px;font-weight:700;padding:6px 0;text-align:right;">${userName}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Email</td><td style="color:#818cf8;font-size:13px;font-weight:700;padding:6px 0;text-align:right;">${userEmail}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Time</td><td style="color:rgba(255,255,255,0.6);font-size:13px;padding:6px 0;text-align:right;">${new Date().toUTCString()}</td></tr>
      </table>
    </div>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">MESSAGE PREVIEW</div>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;margin:0;">${truncated}</p>
    </div>
    <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Reply to this ticket from your admin dashboard.</p>
  `);
  try {
    await transporter.sendMail({
      from: `"Tari Alert System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🎫 New Support Ticket from ${userName}`,
      html,
    });
  } catch (err) {
    console.error("Admin ticket alert error:", err);
  }
}

export async function sendAdminTierChangeAlert(userName: string, userEmail: string, oldTier: string, newTier: string): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Admin alert: Tier change — ${userName} ${oldTier} → ${newTier}`);
    return;
  }
  const html = emailWrapper("👑 User Tier Updated", `
    <div style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:#eab308;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">TIER CHANGE</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">User</td><td style="color:#fff;font-size:13px;font-weight:700;padding:6px 0;text-align:right;">${userName}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Email</td><td style="color:#818cf8;font-size:13px;font-weight:700;padding:6px 0;text-align:right;">${userEmail}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Previous Tier</td><td style="color:rgba(255,255,255,0.5);font-size:13px;font-weight:700;padding:6px 0;text-align:right;text-transform:uppercase;">${oldTier}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">New Tier</td><td style="color:#eab308;font-size:13px;font-weight:900;padding:6px 0;text-align:right;text-transform:uppercase;">${newTier}</td></tr>
        <tr><td style="color:rgba(255,255,255,0.5);font-size:13px;padding:6px 0;">Changed At</td><td style="color:rgba(255,255,255,0.6);font-size:13px;padding:6px 0;text-align:right;">${new Date().toUTCString()}</td></tr>
      </table>
    </div>
  `);
  try {
    await transporter.sendMail({
      from: `"Tari Alert System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `👑 Tier Change: ${userName} upgraded to ${newTier.toUpperCase()}`,
      html,
    });
  } catch (err) {
    console.error("Admin tier change alert error:", err);
  }
}

export async function sendUserTierUpgradeEmail(userEmail: string, userName: string, newTier: string): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] User tier upgrade email for ${userEmail}: ${newTier}`);
    return;
  }
  const tierColors: Record<string, string> = {
    pro: "#60a5fa",
    elite: "#a78bfa",
    business: "#fbbf24",
    free: "#6b7280",
  };
  const tierColor = tierColors[newTier] || "#6366f1";
  const tierFeatures: Record<string, string[]> = {
    pro: ["Priority support queue", "Advanced analytics", "2x API rate limits", "Pro badge on profile"],
    elite: ["Dedicated support line", "Full analytics suite", "10x API rate limits", "Elite badge + perks"],
    business: ["White-glove support", "Custom integrations", "Unlimited API access", "Business badge + SLA"],
    free: ["Standard support", "Basic analytics", "Standard API limits"],
  };
  const features = tierFeatures[newTier] || [];
  const html = emailWrapper(`Your plan has been upgraded to ${newTier.toUpperCase()}`, `
    <p style="color:#fefefe;font-size:16px;margin:0 0 16px;">Hi ${userName},</p>
    <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;margin:0 0 24px;">
      Great news — your Tari Technologies account has been upgraded to the 
      <strong style="color:${tierColor};text-transform:uppercase;">${newTier}</strong> tier!
    </p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid ${tierColor}33;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:${tierColor};text-transform:uppercase;letter-spacing:2px;margin-bottom:14px;">UNLOCKED FEATURES</div>
      ${features.map(f => `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:6px;height:6px;border-radius:50%;background:${tierColor};flex-shrink:0;"></div>
        <span style="color:rgba(255,255,255,0.75);font-size:14px;">${f}</span>
      </div>`).join("")}
    </div>
    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://tari.tech"}/dashboard" style="display:inline-block;background:${tierColor};color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 36px;border-radius:14px;">
        Go to Dashboard →
      </a>
    </div>
  `);
  try {
    await transporter.sendMail({
      from: `"Tari Technologies" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `👑 Your account is now ${newTier.toUpperCase()} — welcome to the next level`,
      html,
    });
  } catch (err) {
    console.error("User tier upgrade email error:", err);
  }
}

export async function sendUserWelcomeEmail(userEmail: string, userName: string): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Welcome email for ${userEmail}`);
    return;
  }
  const html = emailWrapper("Welcome to Tari Technologies", `
    <p style="color:#fefefe;font-size:18px;font-weight:700;margin:0 0 16px;">Welcome, ${userName}! 🚀</p>
    <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;margin:0 0 24px;">
      Your Tari Technologies account is live. You now have access to your personal dashboard,
      project engineering tools, support system, and community hub.
    </p>
    <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:20px 24px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:2px;margin-bottom:14px;">QUICK START</div>
      ${["Complete your profile in Settings","Submit your first project quote","Explore the community hub","Upgrade your plan to unlock more"].map((s, i) => `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <div style="width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="color:#818cf8;font-size:11px;font-weight:900;">${i + 1}</span>
          </div>
          <span style="color:rgba(255,255,255,0.7);font-size:14px;">${s}</span>
        </div>`).join("")}
    </div>
    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://tari.tech"}/dashboard" style="display:inline-block;background:${BRAND_GRADIENT};color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 36px;border-radius:14px;">
        Open Dashboard →
      </a>
    </div>
  `);
  try {
    await transporter.sendMail({
      from: `"Tari Technologies" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Welcome to Tari Technologies, ${userName}!`,
      html,
    });
  } catch (err) {
    console.error("Welcome email error:", err);
  }
}
