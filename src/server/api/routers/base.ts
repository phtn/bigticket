import { CreateChargeParamsSchema } from "@/lib/base/schema/charge";
import { router, proc } from "../trpc";
import { asyncR } from "@/lib/paymongo/utils";
import { base } from "@/lib/base/request/charge";

const createCharge = proc.input(CreateChargeParamsSchema);
export const baseRouter = router({
  createCharge: createCharge.mutation(asyncR(base.charge.create)),
});
