import { z } from "zod";

const AddressSchema = z.object({
  city: z.string(),
  country: z.string(),
  line1: z.string(),
  line2: z.string().nullable(),
  postal_code: z.string(),
  state: z.string(),
});

const BillingSchema = z.object({
  address: AddressSchema,
  email: z.string().email(),
  name: z.string(),
  phone: z.string().nullable(),
});

const LineItemSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
  images: z.array(z.string().url()),
  name: z.string(),
  quantity: z.number(),
});

const PaymentSourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  brand: z.string(),
  country: z.string(),
  last4: z.string(),
});

const TaxSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  inclusive: z.boolean(),
  name: z.string(),
  type: z.string(),
  value: z.string(),
});

const PaymentSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    access_url: z.string().nullable(),
    amount: z.number(),
    balance_transaction_id: z.string(),
    billing: BillingSchema,
    currency: z.string(),
    description: z.string(),
    disputed: z.boolean(),
    external_reference_number: z.string().nullable(),
    fee: z.number(),
    foreign_fee: z.number(),
    livemode: z.boolean(),
    net_amount: z.number(),
    origin: z.string(),
    payment_intent_id: z.string(),
    payout: z.any().nullable(),
    source: PaymentSourceSchema,
    statement_descriptor: z.string(),
    status: z.string(),
    tax_amount: z.number(),
    metadata: z.record(z.string(), z.string()),
    refunds: z.array(z.any()),
    taxes: z.array(TaxSchema),
    available_at: z.number(),
    created_at: z.number(),
    credited_at: z.number(),
    paid_at: z.number(),
    updated_at: z.number(),
  }),
});

const PaymentIntentSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    amount: z.number(),
    capture_type: z.string(),
    client_key: z.string(),
    currency: z.string(),
    description: z.string(),
    livemode: z.boolean(),
    statement_descriptor: z.string(),
    status: z.string(),
    last_payment_error: z.any().nullable(),
    payment_method_allowed: z.array(z.string()),
    payments: z.array(PaymentSchema),
    next_action: z.any().nullable(),
    payment_method_options: z.record(z.string(), z.any()),
    metadata: z.record(z.string(), z.string()),
    setup_future_usage: z.any().nullable(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});

const CheckoutSessionSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    billing: BillingSchema,
    checkout_url: z.string().url(),
    client_key: z.string(),
    description: z.string(),
    line_items: z.array(LineItemSchema),
    livemode: z.boolean(),
    merchant: z.string(),
    payments: z.array(PaymentSchema),
    payment_intent: PaymentIntentSchema,
    payment_method_types: z.array(z.string()),
    reference_number: z.string(),
    send_email_receipt: z.boolean(),
    show_description: z.boolean(),
    show_line_items: z.boolean(),
    status: z.string(),
    success_url: z.string().url(),
    created_at: z.number(),
    updated_at: z.number(),
    metadata: z.record(z.string(), z.string()),
  }),
});

const PaymentEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    type: z.string(),
    livemode: z.boolean(),
    data: CheckoutSessionSchema,
    previous_data: z.record(z.any()),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});

export type PaymentEvent = z.infer<typeof PaymentEventSchema>;
export { PaymentEventSchema };
