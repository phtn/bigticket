import { createCharge, getCharge } from "@/lib/base/callers/charge";
import { type CreateChargeParams } from "@/lib/base/schema/charges";
import { useCallback } from "react";
import type { LifecycleStatus } from "@coinbase/onchainkit/checkout";

export const useBase = (params: CreateChargeParams) => {
  const chargeHandler = useCallback(
    async () => await createCharge(params),
    [params],
  );

  const statusHandler = async (status: LifecycleStatus) => {
    const { statusName, statusData } = status;
    switch (statusName) {
      case "success":
        const { chargeId } = statusData;
        return await getCharge({ chargeId });
      case "pending":
        return "Processing payment..."; // handle payment pending
      case "error":
        return "Payment failed!"; // handle error
      default:
        return "Initializing payment..."; // handle 'init' state
    }
  };

  return { chargeHandler, statusHandler };
};
