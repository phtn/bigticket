import { z } from "zod";

export const StatusSchema = z.union([
  z.literal("unpaid"),
  z.literal("paid"),
  z.literal("refunded"),
  z.literal("partially_refunded"),
  z.literal("disputed"),
]);
export type Status = z.infer<typeof StatusSchema>;

export const LinkResourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    amount: z.number(),
    archived: z.boolean(),
    currency: z.string(),
    description: z.string(),
    livemode: z.boolean(),
    fee: z.number(),
    remarks: z.string(),
    status: z.string(),
    tax_amount: z.number(),
    taxes: z.array(
      z.object({
        amount: z.number(),
        currency: z.string(),
        inclusive: z.boolean(),
        name: z.string(),
        type: z.string(),
        value: z.string(),
      }),
    ),
    checkout_url: z.string(),
    reference_number: z.string(),
    created_at: z.number(),
    updated_at: z.number(),
    payments: z.array(
      z.object({
        data: z.object({
          id: z.string(),
          type: z.string(),
          attributes: z.object({
            access_url: z.null(),
            amount: z.number(),
            balance_transaction_id: z.string(),
            billing: z.object({
              address: z.object({
                city: z.string(),
                country: z.string(),
                line1: z.string(),
                line2: z.string(),
                postal_code: z.string(),
                state: z.string(),
              }),
              email: z.string(),
              name: z.string(),
              phone: z.string(),
            }),
            currency: z.string(),
            description: z.string(),
            disputed: z.boolean(),
            external_reference_number: z.string(),
            fee: z.number(),
            livemode: z.boolean(),
            net_amount: z.number(),
            origin: z.string(),
            payment_intent_id: z.null(),
            payout: z.null(),
            source: z.object({ id: z.string(), type: z.string() }),
            statement_descriptor: z.string(),
            status: StatusSchema,
            tax_amount: z.number(),
            refunds: z.array(
              z.object({
                id: z.string(),
                type: z.string(),
                attributes: z.object({
                  amount: z.number(),
                  balance_transaction_id: z.string(),
                  currency: z.string(),
                  livemode: z.boolean(),
                  metadata: z.null(),
                  notes: z.null(),
                  payment_id: z.string(),
                  payout_id: z.null(),
                  reason: z.string(),
                  status: z.string(),
                  available_at: z.number(),
                  created_at: z.number(),
                  updated_at: z.number(),
                }),
              }),
            ),
            taxes: z.array(
              z.object({
                amount: z.number(),
                currency: z.string(),
                inclusive: z.boolean(),
                name: z.string(),
                type: z.string(),
                value: z.string(),
              }),
            ),
            available_at: z.number(),
            created_at: z.number(),
            paid_at: z.number(),
            updated_at: z.number(),
          }),
        }),
      }),
    ),
  }),
});
export type LinkResource = z.infer<typeof LinkResourceSchema>;

export const CreateLinkParamSchema = z.object({
  data: z.object({
    attributes: z.object({
      amount: z.number(),
      description: z.string(),
      remarks: z.string(),
    }),
  }),
});
export type CreateLinkParam = z.infer<typeof CreateLinkParamSchema>;

export const RetrieveLinkParamSchema = z.object({
  id: z.string(),
});
export type RetrieveLinkParam = z.infer<typeof RetrieveLinkParamSchema>;

export const GetLinkByRefParamSchema = z.object({
  reference_number: z.string(),
});
export type GetLinkByRefParam = z.infer<typeof GetLinkByRefParamSchema>;

export const ArchiveLinkParamSchema = z.object({
  id: z.string(),
});
export type ArchiveLinkParam = z.infer<typeof ArchiveLinkParamSchema>;

export const UnrchiveLinkParamSchema = z.object({
  id: z.string(),
});
export type UnarchiveLinkParam = z.infer<typeof UnrchiveLinkParamSchema>;
