import nodemailer from "nodemailer";
import { config } from "dotenv";
import { env } from "@/env";

config();

async function testSMTPConnection() {
  // SMTP Configuration
  const smtpConfig = {
    host: process.env.SMTP_HOST ?? "smtp.office365.com",
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    secureConnection: false,
    debug: true,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify the connection
    await transporter.verify();
    console.log("✓ SMTP Connection successful!");

    // Send a test email
    const testResult = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_USER, // Sending to yourself as a test
      subject: "SMTP Test Email",
      text: "If you receive this email, your SMTP configuration is working correctly!",
      html: `
        <h1>SMTP Test Successful!</h1>
        <p>If you're reading this, your email configuration is working correctly.</p>
        <p>Configuration used:</p>
        <ul>
          <li>Host: ${smtpConfig.host}</li>
          <li>Port: ${smtpConfig.port}</li>
          <li>Secure: ${smtpConfig.secure}</li>
          <li>User: ${smtpConfig.auth.user}</li>
        </ul>
      `,
    });

    console.log("✓ Test email sent successfully!");
    console.log("Message ID:", testResult.messageId);

    return true;
  } catch (error) {
    console.error("✗ SMTP Test failed:");
    if (error instanceof Error) {
      console.error("Error type:", error.name);
      console.error(`${env.SMTP_USER}`, `${process.env.SMTP_PASSWORD}`);
      console.error("Error message:", error.message);
    }
    return false;
  }
}

// Run the test if this is the main module
if (import.meta.url === new URL(import.meta.url).href) {
  await testSMTPConnection();
}

export default testSMTPConnection;
