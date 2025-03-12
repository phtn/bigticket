import { createCheckout } from "@/server/api/callers/paymongo";
import { Err } from "@/utils/helpers";
import type {
  CheckoutParams,
  CheckoutResource,
} from "@/lib/paymongo/schema/zod.checkout";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const usePaymongo = () => {
  const [loading, setLoading] = useState(false);
  const [checkoutSession, setCheckoutSession] =
    useState<CheckoutResource | null>(null);

  const router = useRouter();

  const checkout = useCallback(
    async (params: CheckoutParams) => {
      if (!params) {
        throw new Error("Checkout parameters are required");
      }

      setLoading(true);
      try {
        const session = await createCheckout(params);
        setCheckoutSession(session);

        const url = session.attributes.checkout_url;
        if (!url) {
          throw new Error("Invalid checkout URL received from server");
        }

        router.push(url);
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
    },
    [router],
  );

  return {
    checkout,
    checkoutSession,
    loading,
  };
};
