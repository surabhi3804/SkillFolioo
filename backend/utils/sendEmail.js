// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

/**
 * Creates a nodemailer transporter from .env variables.
 * Supports: Gmail, SMTP (Mailtrap, SendGrid SMTP, etc.)
 *
 * Required .env vars:
 *   SMTP_HOST     e.g. smtp.gmail.com
 *   SMTP_PORT     e.g. 587
 *   SMTP_USER     your email address / SMTP username
 *   SMTP_PASS     your email password / app password / API key
 *   EMAIL_FROM    e.g. "SkillFolio <noreply@skillfolio.com>"
 */
const createTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

/* ══════════════════════════════════════════════════════════════
   sendResetEmail
   Sends a branded password reset email with a 15-minute link.
══════════════════════════════════════════════════════════════ */
const sendResetEmail = async ({ to, name, resetURL }) => {
  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your SkillFolio password</title>
</head>
<body style="margin:0;padding:0;background:#F1F0FF;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F0FF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#fff;border-radius:16px;overflow:hidden;
                 box-shadow:0 4px 24px rgba(124,58,237,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:#7C3AED;padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:rgba(255,255,255,0.18);border-radius:12px;
                             width:44px;height:44px;text-align:center;vertical-align:middle;">
                    <span style="font-size:22px;line-height:44px;">⚡</span>
                  </td>
                  <td style="padding-left:10px;font-size:22px;font-weight:700;
                             color:#fff;letter-spacing:-0.3px;">
                    SkillFolio
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1E293B;">
                Reset your password
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6;">
                Hi ${name || 'there'}, we received a request to reset your SkillFolio password.
                Click the button below — this link expires in <strong>15 minutes</strong>.
              </p>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="${resetURL}"
                      style="display:inline-block;padding:14px 36px;
                             background:#7C3AED;color:#fff;
                             font-size:15px;font-weight:600;
                             border-radius:10px;text-decoration:none;
                             letter-spacing:0.1px;">
                      Reset Password →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#94A3B8;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#7C3AED;">
                ${resetURL}
              </p>

              <div style="border-top:1px solid #F1F5F9;padding-top:20px;">
                <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.6;">
                  If you didn't request this, you can safely ignore this email.
                  Your password won't change until you click the link above.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:20px 40px;
                       text-align:center;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#94A3B8;">
                © ${new Date().getFullYear()} SkillFolio. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || `"SkillFolio" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your SkillFolio password',
    html,
  });
};

module.exports = { sendResetEmail };