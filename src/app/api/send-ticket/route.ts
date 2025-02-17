import { env } from "@/env";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

// Define the type for request body
interface TicketRequestBody {
  email: string;
  customerName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  seat: string;
  qrCode: string;
  ticketDownloadLink: string;
}

// Configure Nodemailer for GoDaddy
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

// Configure Handlebars template engine
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: path.resolve("src/lib/email/views"),
      defaultLayout: false,
      partialsDir: path.resolve("src/lib/email/views"),
    },
    viewPath: path.resolve("src/lib/email/views"),
    extName: ".hbs",
  }),
);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TicketRequestBody;

    if (!body.email || !body.customerName || !body.eventName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Email options
    const mailOptions = {
      from: `"Festival Tickets" <${env.SMTP_USER}>`, // Use your GoDaddy email
      to: body.email,
      subject: `🎟️ Your VIP Ticket for ${body.eventName}!`,
      template: "ticket",
      context: body,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Ticket email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
