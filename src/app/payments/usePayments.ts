import { type PaymentIntentResource } from "@/lib/paymongo/schema/zod.payment-intent";
import { retrievePaymentIntent } from "@/server/api/callers/paymongo";
import { useCallback, useEffect, useState } from "react";

interface BigTicketTransaction {
  type: "paymongo" | "base";
  cs: number;
  pi: string;
}

export interface PaymentDetail {
  name: string;
  value: string | number | boolean | undefined | null;
}

export const usePayments = () => {
  const [paymentIntent, setPaymentIntent] =
    useState<PaymentIntentResource | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const getPaymentStatus = useCallback(
    async (id: string) => await retrievePaymentIntent({ id }),
    [],
  );

  useEffect(() => {
    const tx = localStorage.getItem("bigticket_tx");

    if (!tx) {
      setLoading(false);
      return;
    }

    try {
      const parsedTx = JSON.parse(tx) as BigTicketTransaction;

      if (parsedTx.type === "paymongo") {
        // fetch payment intent
        getPaymentStatus(parsedTx.pi)
          .then(setPaymentIntent)
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [getPaymentStatus]);

  useEffect(() => {
    if (paymentIntent) {
      setIsPaid(paymentIntent.attributes.status === "succeeded");
      setPaymentDetails(createPaymentDetails(paymentIntent));
    }
  }, [paymentIntent]);

  return {
    paymentDetails,
    loading,
    isPaid,
  };
};

const createPaymentDetails = (paymentIntent: PaymentIntentResource) => {
  const { attributes } = paymentIntent;

  const entry = {
    amount: attributes.amount,
    currency: attributes.currency,
    refNo: attributes.description,
    status: attributes.payments[0]?.attributes.status,
    paymentMethod: attributes.payments[0]?.attributes.source.type,
    paymentSource: attributes.payments[0]?.attributes.source.id,
    paidAt: attributes.payments[0]?.attributes.paid_at,
  };

  return Object.entries(entry).map(([key, value]) => ({ name: key, value }));
};
