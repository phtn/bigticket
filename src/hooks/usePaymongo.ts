import { createCheckout } from "@/server/api/callers/paymongo";
import { Err } from "@/utils/helpers";
import type {
  CheckoutParams,
  CheckoutResource,
} from "@/lib/paymongo/schema/zod.checkout";
import { useCallback, useState } from "react";

export const usePaymongo = () => {
  const [loading, setLoading] = useState(false);
  const [checkoutSession, setCheckoutSession] =
    useState<CheckoutResource | null>(null);

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // useEffect(() => {
  //   const stale_pcs = localStorage.getItem("bigticket_pcs");
  //   if (stale_pcs) {
  //     window.location.href = stale_pcs;
  //   }
  // }, []);

  const checkout = useCallback(async (params: CheckoutParams) => {
    setLoading(true);

    const stale_pcs = localStorage.getItem("bigticket_pcs");
    if (stale_pcs) {
      window.location.href = stale_pcs;
    }

    if (!params) {
      throw new Error("Checkout parameters are required");
    }

    try {
      const session = await createCheckout(params);
      const url = session.attributes.checkout_url;
      setCheckoutSession(session);
      if (url) {
        localStorage.setItem("bigticket_csp", JSON.stringify(params));
        window.location.href = url;
        localStorage.setItem("bigticket_pcs", url);
        setCheckoutUrl(url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Err(setLoading)(error);
      } else {
        Err(setLoading)(new Error("An unknown error occurred"));
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkout,
    checkoutSession,
    checkoutUrl,
    loading,
  };
};
