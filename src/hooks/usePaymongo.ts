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
      // console.log("CHECKOUT SESSION", session);
      const url = session.attributes.checkout_url;
      setCheckoutSession(session);
      if (url) {
        localStorage.setItem("bigticket_csp", JSON.stringify(params));
        localStorage.setItem(
          "bigticket_txn",
          JSON.stringify({
            type: "paymongo",
            cs: session.id,
            pi: session.attributes.payment_intent.id,
          }),
        );
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
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return {
    checkout,
    checkoutSession,
    checkoutUrl,
    loading,
  };
};
