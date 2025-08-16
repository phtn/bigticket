import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { env } from "@/env";
import { VIPInvitation } from "@/app/account/(tabs)/events/e/[id]/components/email/vip-invite";
import { type EmailStatus } from "@/app/account/(tabs)/events/e/[id]/components/email/stream";

type VIP = {
  email: string;
  name: string;
  ticket_count: number;
  event_name: string;
};

// Helper function to stream messages
const sendStatus = (
  controller: ReadableStreamDefaultController,
  status: EmailStatus,
) => {
  controller.enqueue(`${status.message}\n`);
};

// SMTP Verification Function
const verifyTransporter = async (
  transporter: nodemailer.Transporter,
  controller: ReadableStreamDefaultController,
): Promise<boolean> => {
  try {
    sendStatus(controller, {
      type: "connection",
      message: "→← ・ Verifying connection",
    });
    await transporter.verify();
    sendStatus(controller, {
      type: "validation",
      message: "→← ・ Connection verified.",
    });
    return true;
  } catch (error) {
    sendStatus(controller, {
      type: "error",
      message: `⛌ ・SMTP verification failed`,
    });
    console.error(error);
    return false;
  }
};

// Create the nodemailer transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
  logger: false,
  debug: false,
});

// Next.js API Route (Streaming Response)
export async function POST(req: Request) {
  try {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // sendStatus(controller, {
          //   type: "connection",
          //   message: "SMTP connection established!",
          // });

          // Verify SMTP connection
          const isConnected = await verifyTransporter(transporter, controller);
          if (!isConnected) {
            sendStatus(controller, {
              type: "error",
              message: "⛌ ・Failed to establish SMTP connection",
            });
            controller.close();
            return;
          }

          // Parse request body
          const body = (await req.json()) as VIP;
          // sendStatus(controller, {
          //   type: "rendering",
          //   message: `→・Preparing`,
          // });

          // Validate required fields
          if (!body.email || !body.name || !body.ticket_count) {
            sendStatus(controller, {
              type: "error",
              message: "⛌ ・Missing required fields・",
            });
            controller.close();
            return;
          }

          // Render email template
          // sendStatus(controller, {
          //   type: "rendering",
          //   message: "→・Loading..",
          // });
          const invitation = await render(<VIPInvitation {...body} />, {
            pretty: true,
          });

          // Email options
          const mailOptions = {
            from: { name: `Big Ticket`, address: env.SMTP_USER },
            to: body.email,
            subject: `${body.event_name} VIP`,
            html: invitation,
            text: `You have ${body.ticket_count} VIP tickets!`,
            headers: {
              "X-Priority": "1",
              "X-MSMail-Priority": "High",
              Importance: "high",
            },
          };

          // Send email
          sendStatus(controller, {
            type: "sending",
            message: "↑ ・ Sending email ...",
          });
          const info = await transporter.sendMail(mailOptions);
          sendStatus(controller, {
            type: "complete",
            message: `✅ Email sent successfully! Message ID: ${info.messageId}`,
          });

          // Close stream
          controller.close();
        } catch (error) {
          sendStatus(controller, {
            type: "error",
            message: `⛌ ・Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
