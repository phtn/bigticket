import { z } from "zod";

const EmailTypeSchema = z.enum(["VIP_INVITE", "COHOST_INVITE"]);
export type EmailType = z.infer<typeof EmailTypeSchema>;

const AttachmentsSchema = z
  .array(
    z.object({
      filename: z.string().min(1).max(100),
      content: z.instanceof(Buffer),
    }),
  )
  .optional();

export const EmailContextSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  subject: z.string().min(1).max(100).optional(),
  react: z.string().min(1).max(1000).optional(),
  html: z.string().min(1).max(1000).optional(),
  text: z.string().min(1).max(1000).optional(),
  attachments: AttachmentsSchema,
  headers: z.record(z.string()).optional(),
});

export type EmailContext = z.infer<typeof EmailContextSchema>;

export const EmailOptionsSchema = z.object({
  to: z.array(z.string().email()),
  subject: z.string().max(100).optional(),
  type: EmailTypeSchema,
  data: z.record(z.string(), z.any()),
  text: z.string().max(100).optional(),
  attachments: AttachmentsSchema,
  host: z.string().optional(),
});

export type EmailOptions = z.infer<typeof EmailOptionsSchema>;
