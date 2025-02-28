import { env } from "@/env";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { type VIP } from "convex/events/d";
import { BigTicketInvitation } from "@/app/account/(tabs)/events/e/[id]/components/email/invitation";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST, // GoDaddy SMTP
  port: Number(env.SMTP_PORT), // Use 465 for SSL or 587 for TLS
  secure: true, // Set to 'true' for port 465 (SSL), 'false' for port 587 (TLS)
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Fix possible SSL issues
  },
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VIP;

    if (!body.email || !body.name || !body.ticket_count) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const invitation = await render(<BigTicketInvitation {...body} />, {
      pretty: true,
    });
    const options = {
      from: `"You're invited!" <${env.SMTP_USER}>`,
      to: body.email,
      subject: `${body.ticket_count} VIP Tickets!!`,
      html: invitation,
      context: body,
    };

    await transporter.sendMail(options);

    return NextResponse.json({ message: "Email sent!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
