import nodemailer, { type Transporter } from "nodemailer";
import Handlebars from "handlebars";
import { emailTemplates } from "./templates";
import type {
  EmailConfig,
  EmailData,
  EmailResponse,
  EmailAddress,
} from "@/app/types";

const createEmailTransporter = (config: EmailConfig): Transporter => {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    pool: true,
    maxConnections: 5,
  });
};

const getEmailConfig = (): EmailConfig => {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM_EMAIL",
  ] as const;

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
    fromEmail: process.env.SMTP_FROM_EMAIL!,
  };
};

const renderTemplate = async (
  templateName: string,
  data: Record<string, unknown>,
): Promise<{ html: string; subject: string }> => {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }

  const compiledHtml = Handlebars.compile(template.html);
  const compiledSubject = Handlebars.compile(template.subject);

  return {
    html: compiledHtml(data),
    subject: compiledSubject(data),
  };
};

const sendSingleEmail = async (
  transporter: Transporter,
  config: EmailConfig,
  emailData: EmailData,
  recipient: EmailAddress,
): Promise<EmailResponse> => {
  try {
    let html = emailData.html;
    let subject = emailData.subject;

    if (emailData.template && emailData.templateData) {
      const rendered = await renderTemplate(
        emailData.template,
        emailData.templateData,
      );
      html = rendered.html;
      subject = rendered.subject;
    }

    const mailOptions = {
      from: config.fromEmail,
      to: recipient,
      subject,
      html,
      text: emailData.text ?? html?.replace(/<[^>]*>/g, ""),
      attachments: emailData.attachments,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const sendEmail = async (
  emailData: EmailData,
): Promise<EmailResponse> => {
  try {
    const config = getEmailConfig();
    const transporter = createEmailTransporter(config);

    if (Array.isArray(emailData.to)) {
      const results = await Promise.all(
        emailData.to.map((recipient) =>
          sendSingleEmail(transporter, config, emailData, recipient),
        ),
      );

      const failedEmails = results.filter((result) => !result.success);
      if (failedEmails.length > 0) {
        return {
          success: false,
          error: `Failed to send ${failedEmails.length} out of ${results.length} emails`,
        };
      }

      return { success: true };
    }

    return sendSingleEmail(transporter, config, emailData, emailData.to);
  } catch (error) {
    console.error("Email service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
