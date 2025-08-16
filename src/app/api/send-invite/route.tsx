import { VIPInvitation } from "@/app/account/(tabs)/events/e/[id]/components/email/vip-invite";
import { env } from "@/env";
import { render } from "@react-email/components";
import { type VIP } from "convex/events/d";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export interface SMTPResponse {
  success: boolean;
  messageId: string;
  message: string;
}

// Verify connection before sending
const verifyTransporter = async (transporter: nodemailer.Transporter) => {
  try {
    const verification = await transporter.verify();
    console.log("✅ SMTP connection verified:", verification);
    return true;
  } catch (error) {
    console.error("❌ SMTP verification failed:", error);
    return false;
  }
};

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: false,
  debug: false,
});

export async function POST(req: Request) {
  try {
    // Verify SMTP connection
    const isConnected = await verifyTransporter(transporter);
    if (!isConnected) {
      throw new Error("SMTP connection failed");
    }

    const body = (await req.json()) as VIP;
    console.log("📧 Attempting to send email to:", body.email);

    // Validate required fields
    if (!body.email || !body.name || !body.ticket_count) {
      console.error("❌ Missing required fields:", body);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Render email template
    const invitation = await render(<VIPInvitation {...body} />, {
      pretty: true,
    });

    // Configure email options
    const mailOptions = {
      from: {
        name: `Big Ticket`,
        address: env.SMTP_USER,
      },
      to: body.email,
      subject: `${body.event_name} VIP`,
      html: invitation,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
      text: `You have ${body.ticket_count} VIP tickets!`, // Plain text fallback
    };

    // Send email and await response
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Return more detailed error information
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
