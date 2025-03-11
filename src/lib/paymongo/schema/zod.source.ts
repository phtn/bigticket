import { z } from "zod";
import {
  BillingSchema,
  CurrencySchema,
  PaymentMethods,
  RedirectSchema,
} from "./zod.common";

export const SourceErrorSchema = z.object({
  pointer: z.string(),
  attribute: z.string(),
});
export type SourceError = z.infer<typeof SourceErrorSchema>;

export const SourceSchema = z.object({
  id: z.string(),
  type: z.literal("source"),
});
export type Source = z.infer<typeof SourceSchema>;

export const SourceStatusSchema = z.union([
  z.literal("pending"),
  z.literal("chargeable"),
  z.literal("cancelled"),
  z.literal("expired"),
  z.literal("paid"),
]);
export type SourceStatus = z.infer<typeof SourceStatusSchema>;

export const SourceResourceSchema = z.object({
  id: z.string(),
  type: z.literal("source"),
  attributes: z.object({
    amount: z.number(),
    billing: BillingSchema.optional(),
    currency: CurrencySchema,
    livemode: z.boolean(),
    redirect: RedirectSchema,
    status: SourceStatusSchema,
    type: PaymentMethods,
    created_at: z.number(),
    updated_at: z.number(),
  }),
});
export type SourceResource = z.infer<typeof SourceResourceSchema>;

export const CreateSourceParamsSchema = z.object({
  data: z.object({
    attributes: z.object({
      type: PaymentMethods,
      amount: z.number(),
      currency: CurrencySchema,
      redirect: RedirectSchema,
      billing: BillingSchema.optional(),
      metadata: z.record(z.string().or(z.number().or(z.boolean()))).optional(),
    }),
  }),
});
export type CreateSourceParams = z.infer<typeof CreateSourceParamsSchema>;

export const RetrieveSourceParamsSchema = z.object({
  id: z.string(),
});
export type RetrieveSourceParams = z.infer<typeof RetrieveSourceParamsSchema>;
