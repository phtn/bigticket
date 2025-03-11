import { z } from "zod";
import {
  AllowedPaymentMethodsSchema,
  CurrencySchema,
  ErrorSubCodeSchema,
  MetadataTypeSchema,
  PaymentMethods,
  SpecialPaymentMethodTypeList,
} from "./zod.common";
import { PaymentResourceSchema } from "./zod.payments";

export const PaymentIntentStatusSchema = z.union([
  z.literal("awaiting_payment_method"),
  z.literal("awaiting_next_action"),
  z.literal("processing"),
  z.literal("succeeded"),
]);
export type PaymentIntentStatus = z.infer<typeof PaymentIntentStatusSchema>;

export const LastPaymentErrorSchema = z.object({
  payment: z.string(),
  failed_code: ErrorSubCodeSchema,
  failed_message: z.string(),
  payment_method: z.string(),
});
export type LastPaymentError = z.infer<typeof LastPaymentErrorSchema>;

export const NextActionSchema = z.object({
  type: z.literal("redirect"),
  redirect: z.object({
    url: z.string(),
    return_url: z.string(),
  }),
});
export type NextAction = z.infer<typeof NextActionSchema>;

export const PaymentMethodOptionsSchema = z.object({
  card: z.object({
    request_three_d_secure: z.literal("any"),
  }),
});
export type PaymentMethodOptions = z.infer<typeof PaymentMethodOptionsSchema>;

export const PaymentIntentResourceSchema = z.object({
  id: z.string(),
  type: z.literal("payment_intent"),
  attributes: z.object({
    amount: z.number(),
    capture_type: z.literal("automatic"),
    client_key: z.string(),
    currency: CurrencySchema,
    description: z.string().optional(),
    livemode: z.boolean(),
    statement_descriptor: z.string(),
    status: PaymentIntentStatusSchema,
    created_at: z.number(),
    updated_at: z.number(),
    last_payment_error: LastPaymentErrorSchema.optional(), // Assuming LastPaymentErrorSchema is defined elsewhere
    payment_method_allowed: SpecialPaymentMethodTypeList,
    payments: z.array(PaymentResourceSchema), // Assuming PaymentResourceSchema is defined elsewhere
    next_action: NextActionSchema.nullable(), // Assuming NextActionSchema is defined elsewhere
    payment_method_options: PaymentMethodOptionsSchema.optional(), // Assuming PaymentMethodOptionsSchema is defined elsewhere
    metadata: MetadataTypeSchema,
    setup_future_usage: z.boolean().nullable(),
  }),
});
export type PaymentIntentResource = z.infer<typeof PaymentIntentResourceSchema>;

export const CreatePaymentIntentParamsSchema = z.object({
  data: z.object({
    attributes: z.object({
      amount: z.number(),
      currency: CurrencySchema,
      payment_method_allowed: AllowedPaymentMethodsSchema,
      payment_method_options: PaymentMethodOptionsSchema.optional(),
      capture_type: z.literal("automatic"),
      description: z.string().optional(),
      statement_descriptor: z.string().optional(),
      metadata: MetadataTypeSchema.optional(),
    }),
  }),
});
export type CreatePaymentIntentParams = z.infer<
  typeof CreatePaymentIntentParamsSchema
>;

export const BaseRetrievePaymentIntentParamsSchema = z.object({
  id: z.string(),
  client_key: z.string().optional(),
});
export type BaseRetrievePaymentIntentParams = z.infer<
  typeof BaseRetrievePaymentIntentParamsSchema
>;

export const RetrievePaymentIntentParamsUsingPublicSchema = z.object({
  client_key: z.string(),
  id: z.string(),
});
export type RetrievePaymentIntentParamsUsingPublic = z.infer<
  typeof RetrievePaymentIntentParamsUsingPublicSchema
>;

export const BaseAttachPaymentIntentParamsSchema = z.object({
  data: z.object({
    attributes: z.object({
      payment_method: z.string(),
      client_key: z.string(),
      return_url: z.string().optional(),
    }),
  }),
});

export type BaseAttachPaymentIntentParams = z.infer<
  typeof BaseAttachPaymentIntentParamsSchema
>;

export const AttachPaymentIntentParamsUsingPublicSchema = z.object({
  id: z.string(),
  data: z.object({
    attributes: z.object({
      payment_method: PaymentMethods,
      client_key: z.string(),
      return_url: z.string().url().optional(),
    }),
  }),
});

export type AttachPaymentIntentParamsUsingPublic = z.infer<
  typeof AttachPaymentIntentParamsUsingPublicSchema
>;

export const AttachPaymentIntentParamsSchema = z.union([
  AttachPaymentIntentParamsUsingPublicSchema,
  BaseAttachPaymentIntentParamsSchema,
]);
export type AttachPaymentIntentParams = z.infer<
  typeof AttachPaymentIntentParamsSchema
>;
