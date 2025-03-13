import { z } from "zod";

export const CreateCheckoutParamsSchema = z.object({
  buyer_locale: z.string().optional(),
  total_price: z.object({
    amount: z.string().min(1),
    currency: z.string().min(3).max(3),
  }),
  metadata: z.record(z.string().max(255)).optional(),
  pricing_type: z.enum(["fixed_price", "per_unit"]),
  requested_info: z.array(z.enum(["email", "name", "phone_number"])).optional(),
});

export type CreateCheckoutParams = z.infer<typeof CreateCheckoutParamsSchema>;

export const GetCheckoutParamsSchema = z.object({
  checkoutId: z.string(),
});

export type GetCheckoutParams = z.infer<typeof GetCheckoutParamsSchema>; 