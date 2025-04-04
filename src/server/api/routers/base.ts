import {
  CreateChargeParamsSchema,
  GetChargeParamsSchema,
} from "@/lib/base/schema/charges";
import { router, proc, mergeRouters } from "../trpc";
import { charges, checkout } from "@/lib/base/request";
import {
  CreateCheckoutParamsSchema,
  GetCheckoutParamsSchema,
} from "@/lib/base/schema/checkout";
import { asyncR } from "../utils";

const chargesRouter = router({
  createCharge: proc
    .input(CreateChargeParamsSchema)
    .mutation(asyncR(charges.create)),
  getCharge: proc.input(GetChargeParamsSchema).query(asyncR(charges.get)),
});

const checkoutRouter = router({
  createCheckout: proc
    .input(CreateCheckoutParamsSchema)
    .mutation(asyncR(checkout.create)),
  getCheckout: proc.input(GetCheckoutParamsSchema).query(asyncR(checkout.get)),
});

export const base = mergeRouters(chargesRouter, checkoutRouter);
