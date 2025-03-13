import { createCharge, getCharge } from "@/lib/base/callers/charge";
import type { Charge, CreateChargeParams } from "@/lib/base/schema/charges";
import { useCallback, useState } from "react";
import type { LifecycleStatus } from "@coinbase/onchainkit/checkout";
import { Err } from "@/utils/helpers";

export const useBase = (params: CreateChargeParams) => {
  const [loading, setLoading] = useState(false);
  const chargeHandler = useCallback(async () => {
    setLoading(true);
    await createCharge(params)
      .then(({ data }: { data: Charge }) => {
        if (data.hosted_url) {
          setLoading(false);
          window.location.href = data.hosted_url;
        }
      })
      .catch(Err(setLoading));
  }, [params]);

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

  return { chargeHandler, statusHandler, loading };
};
