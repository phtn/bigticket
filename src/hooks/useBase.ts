import { createCharge } from "@/lib/base/callers/charge";
import { type CreateChargeParams } from "@/lib/base/schema/charge";
import { useCallback } from "react";

export const useBase = (params: CreateChargeParams) => {
  const chargeHandler = useCallback(
    async () => await createCharge(params),
    [params],
  );

  return { chargeHandler };
};
