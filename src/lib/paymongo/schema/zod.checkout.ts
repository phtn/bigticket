import { z } from "zod";
import { MetadataSchema, PaymentMethodTypeList } from "./zod.common";
import { PaymentResourceSchema } from "./zod.payments";
import { PaymentIntentResourceSchema } from "./zod.payment-intent";

export const AddressSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
});

export type Address = z.infer<typeof AddressSchema>;

export const BillingSchema = z.object({
  address: AddressSchema.optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});
export type Billing = z.infer<typeof BillingSchema>;

export const LineItemSchema = z.object({
  amount: z.number(),
  currency: z.literal("PHP"),
  description: z.string(),
  images: z.array(z.string()).optional(),
  name: z.string(),
  quantity: z.number(),
});
export type LineItem = z.infer<typeof LineItemSchema>;
// card, gcash, grab_pay, paymaya, dob, dob_ubp, brankas_bdo, brankas_landbank,
// brankas_metrobank
export const AttributesParamsSchema = z.object({
  billing: BillingSchema.optional(),
  cancel_url: z.string().url().optional(),
  description: z.string().nullable(),
  images: z.array(z.string().url()).optional(), // pass single item only
  line_items: z.array(LineItemSchema),
  payment_method_types: PaymentMethodTypeList,
  reference_number: z.string().optional(),
  send_email_receipt: z.boolean().default(false),
  show_description: z.boolean().default(true),
  show_line_items: z.boolean().default(true),
  success_url: z.string().url().optional(),
  statement_descriptor: z.string().optional(),
});
export type Attributes = z.infer<typeof AttributesParamsSchema>;

export const CheckoutParamsSchema = z.object({
  data: z.object({
    attributes: AttributesParamsSchema,
  }),
});
export type CheckoutParams = z.infer<typeof CheckoutParamsSchema>;

// The complete cs_resource schema
export const CheckoutResourceSchema = z.object({
  id: z.string(),
  type: z.literal("checkout_session"),
  attributes: z.object({
    billing: BillingSchema,
    billing_information_fields_editable: z.literal("enabled"),
    cancel_url: z.string().url(),
    checkout_url: z.string().url(),
    client_key: z.string(),
    description: z.string().nullable(),
    line_items: z.array(LineItemSchema),
    live_mode: z.boolean(),
    merchant: z.string(),
    payments: z.array(PaymentResourceSchema),
    payment_intent: PaymentIntentResourceSchema,
    payment_method_types: PaymentMethodTypeList,
    reference_number: z.string(),
    send_email_receipt: z.boolean().default(true),
    show_description: z.boolean().default(true),
    show_line_items: z.boolean().default(true),
    status: z.union([z.literal("active"), z.literal("inactive")]),
    success_url: z.string().url(),
    created_at: z.number(),
    updated_at: z.number(),
    metadata: MetadataSchema.nullable(),
  }),
});
export type CheckoutResource = z.infer<typeof CheckoutResourceSchema>;

export const RetrieveCheckoutParamsSchema = z.object({
  checkout_session_id: z.string(),
});

export type RetrieveCheckoutParams = z.infer<
  typeof RetrieveCheckoutParamsSchema
>;
export const ExpireCheckoutParamsSchema = z.object({
  checkout_session_id: z.string(),
});
export type ExpireCheckoutParams = z.infer<typeof ExpireCheckoutParamsSchema>;
