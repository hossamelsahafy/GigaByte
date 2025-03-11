import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, token, email }) => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_HOST}/auth/reset-password/${token}?email=${email}`;

    const html = `
      <div style="
        background-color: ${process.env.EMAIL_BG_COLOR || "#0b0c10"};
        color: ${process.env.EMAIL_TEXT_COLOR || "#c5c6c7"};
        padding: 2rem;
        font-family: Arial, sans-serif;
      ">
        <h2 style="color: #ffcc29;">Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to continue:</p>
        <a href="${resetUrl}"
          style="
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #ffcc29;
            color: #0b0c10;
            text-decoration: none;
            border-radius: 4px;
            margin: 1rem 0;
          ">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p style="color: #888; font-size: 0.9rem;">
          If you didn't request this password reset, please ignore this email.
        </p>
      </div>
    `;

    const text = `Password Reset Request\n\n
      Please visit the following link to reset your password:\n
      ${resetUrl}\n\n
      This link expires in 1 hour.`;

    await transporter.sendMail({
      from: `"${process.env.SMTP_SERVER_USERNAME || "Your App"}" <${process.env.EMAIL_FROM_ADDRESS || "no-reply@example.com"}>`,
      to,
      subject: subject || "Password Reset Request",
      text,
      html,
    });

    console.log(`✅ Password reset email sent to ${to}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};
