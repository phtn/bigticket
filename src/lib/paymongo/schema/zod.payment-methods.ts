import { z } from "zod";
import {
  AllowedPaymentMethodsSchema,
  BillingSchema,
  MetadataSchema,
} from "./zod.common";

export const CreatePaymentMethodParamsSchema = z.object({
  data: z.object({
    attributes: z.object({
      type: AllowedPaymentMethodsSchema,
      details: z
        .object({
          card_number: z.string(),
          exp_month: z.number(),
          exp_year: z.number(),
          cvc: z.string(),
        })
        .optional(),
      billing: BillingSchema.optional(),
      metadata: MetadataSchema.optional(),
    }),
  }),
});

export type CreatePaymentMethodParams = z.infer<
  typeof CreatePaymentMethodParamsSchema
>;

export const PaymentMethodResourceSchema = z.object({
  data: z.object({
    attributes: z.object({
      livemode: z.boolean(),
      type: AllowedPaymentMethodsSchema,
      billing: BillingSchema.optional(),
      details: z
        .object({
          last4: z.string(),
          exp_month: z.number(),
          exp_year: z.number(),
        })
        .optional(),
      metadata: MetadataSchema.optional(),
    }),
  }),
});

export type PaymentMethodResource = z.infer<typeof PaymentMethodResourceSchema>;

export const RetrievePaymentMethodParamsSchema = z.object({ id: z.string() });

export type RetrievePaymentMethodParams = z.infer<
  typeof RetrievePaymentMethodParamsSchema
>;
