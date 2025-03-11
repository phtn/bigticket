import { z } from "zod";

export const webhookResource = {
  data: {
    id: "hook_id",
    type: "webhook",
    attributes: {
      livemode: true,
      secret_key: "sk",
      status: "enabled",
      url: "https://mywebsite:3000/webhooks",
      events: ["source.chargeable", "payment.paid", "payment.failed"],
      created_at: 1586194939,
      updated_at: 1586194939,
    },
  },
};

export const WebhookResourceSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: z.object({
      livemode: z.boolean(),
      secret_key: z.string(),
      status: z.string(),
      url: z.string(),
      events: z.array(z.string()),
      created_at: z.number(),
      updated_at: z.number(),
    }),
  }),
});
export type WebhookResource = z.infer<typeof WebhookResourceSchema>;

export const WebhookEvents = z.union([
  z.literal("source.chargaeble"),
  z.literal("payment.paid"),
  z.literal("payment.failed"),
  z.literal("payment.refunded"),
  z.literal("payment.refund.updated"),
  z.literal("link.payment.paid"),
  z.literal("checkout_session.payment.paid"),
  z.literal("qrph.expired"),
]);
export type WebhookEvent = z.infer<typeof WebhookEvents>;

export const CreateWebhookParamsSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()),
});
export type CreateWebhookParams = z.infer<typeof CreateWebhookParamsSchema>;

export const RetrieveWebhookParamsSchema = z.object({
  id: z.string(),
});
export type RetrieveWebhookParams = z.infer<typeof RetrieveWebhookParamsSchema>;

export const EnableWebhookParamsSchema = z.object({
  id: z.string(),
});
export type EnableWebhookParams = z.infer<typeof EnableWebhookParamsSchema>;

export const DisableWebhookParamsSchema = z.object({
  id: z.string(),
});
export type DisableWebhookParams = z.infer<typeof DisableWebhookParamsSchema>;

export const UpdateWebhookParamsSchema = z.object({
  id: z.string(),
  data: CreateWebhookParamsSchema,
});
export type UpdateWebhookParams = z.infer<typeof UpdateWebhookParamsSchema>;
