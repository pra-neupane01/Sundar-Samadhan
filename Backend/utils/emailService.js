const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  // 🔹 For development: Always log to console so you can test without real SMTP
  console.log("-----------------------------------------");
  console.log("📨 EMAIL SENT TO:", to);
  console.log("📌 SUBJECT:", subject);
  
  // Extract reset link from HTML if present for easy clicking in console
  const linkMatch = html.match(/href="([^"]+)"/);
  if (linkMatch && linkMatch[1]) {
    console.log("🔗 RESET LINK:", linkMatch[1]);
  }
  console.log("-----------------------------------------");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Timeout after 10 seconds so it doesn't hang the whole server
      connectionTimeout: 10000, 
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `"Sundar Samadhan" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email send error (Check your SMTP credentials in .env):", error.message);
    // Returning true even on error during development so the user can still use the console link
    return process.env.NODE_ENV !== "production"; 
  }
};

module.exports = sendEmail;
