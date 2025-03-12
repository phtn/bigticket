import { z } from "zod";

export const CreateChargeParamsSchema = z.object({
  local_price: z.object({
    amount: z.number().min(1).max(10000),
    currency: z.string().min(3).max(6),
  }),
  pricing_type: z.string().min(3).max(3),
  metadata: z.record(z.string().min(1).max(255)),
});

export type CreateChargeParams = z.infer<typeof CreateChargeParamsSchema>;
