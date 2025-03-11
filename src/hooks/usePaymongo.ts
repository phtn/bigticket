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
      const ok = (session: CheckoutResource) => {
        setCheckoutSession(session);
        const checkoutUrl = session.attributes.checkout_url;
        router.push(checkoutUrl);
        setLoading(false);
      };
      await createCheckout(params).then(ok).catch(Err(setLoading));
    },
    [router],
  );

  return {
    checkout,
    checkoutSession,
    loading,
  };
};
