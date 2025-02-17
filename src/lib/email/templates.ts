import type { EmailTemplate } from "@/app/types";

export const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    name: "welcome",
    subject: "Welcome to {{appName}}!",
    html: `
      <h1>Welcome to {{appName}}, {{userName}}!</h1>
      <p>We're excited to have you on board.</p>
      <p>Your account has been successfully created.</p>
      {{#if verificationLink}}
      <p>Please verify your email by clicking <a href="{{verificationLink}}">here</a></p>
      {{/if}}
    `,
  },
  resetPassword: {
    name: "resetPassword",
    subject: "Password Reset Request",
    html: `
      <h1>Password Reset</h1>
      <p>Hello {{userName}},</p>
      <p>You recently requested to reset your password.</p>
      <p>Click <a href="{{resetLink}}">here</a> to reset your password.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  },
} as const;
