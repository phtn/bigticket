import { type SelectEvent } from "convex/events/d";
import type { HTMLProps, Dispatch, SetStateAction } from "react";

export type ClassName = HTMLProps<HTMLElement>["className"];

// EMAIL TYPES
export type EmailAddress = string;

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
}

export interface EmailAttachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
}

export interface EmailData {
  to: EmailAddress | EmailAddress[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  templateData?: Record<string, unknown>;
  attachments?: EmailAttachment[];
}

export interface EmailResponse {
  success: boolean;
  error?: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromEmail: string;
}

export type XEvent = SelectEvent & { cover_src: string | null };

export type SetState<T> = Dispatch<SetStateAction<T>>;
export type FPromise<T> = () => Promise<T>;
