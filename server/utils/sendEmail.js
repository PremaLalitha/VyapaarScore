const nodemailer = require('nodemailer');

/**
 * Sends an OTP email to the user.
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit verification code
 * @param {string} subject - Email subject line
 */
const sendOTPEmail = async (email, otp, subject = 'VyapaarScore Verification Code') => {
  console.log(`\n==================================================`);
  console.log(`[AUTH OTP SERVICE] Email: ${email} | OTP: ${otp}`);
  console.log(`==================================================\n`);

  // Check if SMTP is configured
  const hasSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSMTP) {
    console.log(`[SMTP INFO] SMTP credentials not provided in .env. Skipping external email send, but OTP [${otp}] is ready for verification.`);
    return { success: true, mode: 'console_fallback' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0F172A; color: #F8FAFC; padding: 32px; border-radius: 12px; border: 1px solid #1E293B;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0284C7; font-size: 24px; font-weight: 800; margin: 0;">Vyapaar<span style="color: #F59E0B;">Score</span></h1>
          <p style="color: #94A3B8; font-size: 14px; margin-top: 4px;">Alternative Credit Scoring for Small Business</p>
        </div>
        <div style="background-color: #1E293B; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #CBD5E1; font-size: 14px; margin-top: 0;">Your verification code is:</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38BDF8; margin: 16px 0;">${otp}</div>
          <p style="color: #64748B; font-size: 12px; margin-bottom: 0;">This code expires in 5 minutes. Do not share it with anyone.</p>
        </div>
        <p style="color: #64748B; font-size: 12px; text-align: center; margin: 0;">If you didn't request this code, please ignore this email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"VyapaarScore" <no-reply@vyapaarscore.com>',
      to: email,
      subject: subject,
      html: htmlContent,
    });

    return { success: true, mode: 'smtp' };
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email via SMTP: ${error.message}`);
    // Return success true so dev workflow isn't blocked, since OTP is logged in console
    return { success: true, mode: 'console_fallback', error: error.message };
  }
};

const sendDecisionNotificationEmail = async (email, merchantName, decision, lenderName) => {
  console.log(`\n==================================================`);
  console.log(`[LOAN DECISION NOTIFICATION] Email: ${email} | Decision: ${decision.toUpperCase()}`);
  console.log(`==================================================\n`);

  const hasSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (!hasSMTP) {
    console.log(`[SMTP INFO] SMTP credentials not set. Loan notification logged to console.`);
    return { success: true, mode: 'console_fallback' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const isApproved = decision === 'approved';
    const statusColor = isApproved ? '#16A34A' : '#DC2626';

    const htmlContent = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0F172A; color: #F8FAFC; padding: 32px; border-radius: 12px; border: 1px solid #1E293B;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0284C7; font-size: 24px; font-weight: 800; margin: 0;">Vyapaar<span style="color: #F59E0B;">Score</span></h1>
          <p style="color: #94A3B8; font-size: 14px; margin-top: 4px;">Loan Application Update</p>
        </div>
        <div style="background-color: #1E293B; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #CBD5E1; font-size: 14px; margin-top: 0;">Hello ${merchantName},</p>
          <p style="color: #94A3B8; font-size: 13px;">Your loan application evaluated by <strong>${lenderName || 'NBFC Partner Lender'}</strong> has been:</p>
          <div style="font-size: 24px; font-weight: 800; color: ${statusColor}; margin: 16px 0; text-transform: uppercase;">${decision}</div>
          <p style="color: #94A3B8; font-size: 12px;">Log in to your VyapaarScore Merchant Dashboard to review details.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"VyapaarScore" <no-reply@vyapaarscore.com>',
      to: email,
      subject: `VyapaarScore: Loan Application ${decision.toUpperCase()}`,
      html: htmlContent,
    });

    return { success: true, mode: 'smtp' };
  } catch (error) {
    console.error(`[NOTIFICATION SMTP ERROR] ${error.message}`);
    return { success: true, mode: 'console_fallback' };
  }
};

module.exports = { sendOTPEmail, sendDecisionNotificationEmail };

