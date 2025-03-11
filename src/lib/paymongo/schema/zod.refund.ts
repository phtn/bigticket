import { z } from "zod";

export const RefundResourceSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: z.object({
      amount: z.number(),
      currency: z.string(),
      livemode: z.boolean(),
      notes: z.string(),
      payment_id: z.string(),
      payout_id: z.null(),
      reason: z.string(),
      status: z.string(),
      created_at: z.number(),
      updated_at: z.number(),
    }),
  }),
});

export type RefundResource = z.infer<typeof RefundResourceSchema>;

export const CreateRefundParamsSchema = z.object({
  data: z.object({
    attributes: z.object({
      amount: z.number(),
      notes: z.string(),
      payment_id: z.string(),
      payout_id: z.null(),
      reason: z.string(),
    }),
  }),
});
export type CreateRefundParams = z.infer<typeof CreateRefundParamsSchema>;

export const RetrieveRefundParamsSchema = z.object({
  id: z.string(),
});
export type RetrieveRefundParams = z.infer<typeof RetrieveRefundParamsSchema>;

export const ListAllRefundsParamsSchema = z.object({
  data: z.object({
    attributes: z.object({
      payment_id: z.string(),
      before: z.string().optional(),
      after: z.string().optional(),
      limit: z.number().optional(),
    }),
  }),
});
export type ListAllRefundsParams = z.infer<typeof ListAllRefundsParamsSchema>;

export const refundResource = {
  data: {
    id: "ref_vPSqdAPD2pmtKj6Ac5SRfXjs",
    type: "refund",
    attributes: {
      amount: 10000,
      currency: "PHP",
      livemode: true,
      notes: "Double payment created",
      payment_id: "pay_qOShdAuD3p8tKa6Ac4SRfbjs",
      payout_id: null,
      reason: "requested_by_customer",
      status: "succeeded",
      created_at: 1612746914,
      updated_at: 1612746914,
    },
  },
};
