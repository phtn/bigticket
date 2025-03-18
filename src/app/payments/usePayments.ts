import { type PaymentIntentResource } from "@/lib/paymongo/schema/zod.payment-intent";
import { retrievePaymentIntent } from "@/server/api/callers/paymongo";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { api } from "@vx/api";
import { useAuth } from "../ctx/auth/provider";
import { Err } from "@/utils/helpers";

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
    const txn = localStorage.getItem("bigticket_txn");

    if (!txn) {
      setLoading(false);
      return;
    }

    try {
      const parsedTxn = JSON.parse(txn) as BigTicketTransaction;

      if (parsedTxn.type === "paymongo") {
        // fetch payment intent
        getPaymentStatus(parsedTxn.pi)
          .then(setPaymentIntent)
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // TODO: Implement payment status for other payment methods (base)
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [getPaymentStatus]);

  const saveFn = useMutation(api.transactions.create.default);
  const { user } = useAuth();

  useEffect(() => {
    if (paymentIntent && user) {
      setIsPaid(paymentIntent.attributes.status === "succeeded");
      setPaymentDetails(createPaymentDetails(paymentIntent));

      const saveTransaction = async () => {
        try {
          await saveFn({
            txn_id: paymentIntent.id.substring(3),
            user_id: user.id,
            type: paymentIntent.attributes.payments[0]?.type,
            amount: parseFloat(
              (paymentIntent.attributes.amount / 100).toFixed(2),
            ),
            mode: paymentIntent.attributes.payments[0]?.attributes.source.type,
            currency: paymentIntent.attributes.currency,
            status: paymentIntent.attributes.status,
          });
        } catch (error) {
          console.error(error);
        }
      };

      saveTransaction().catch(Err);
    }
  }, [paymentIntent, saveFn, user]);

  return {
    paymentDetails,
    loading,
    isPaid,
  };
};

const createPaymentDetails = (paymentIntent: PaymentIntentResource) => {
  const { attributes } = paymentIntent;

  const entry = {
    amount: `${attributes.currency} ${(attributes.amount / 100).toFixed(2)}`,
    type: paymentIntent.attributes.payments[0]?.type,
    refNo: attributes.description,
    status: attributes.payments[0]?.attributes.status,
    mode: attributes.payments[0]?.attributes.source.type,
    source: attributes.payments[0]?.attributes.source.id.substring(4, 10),
    date: +`${attributes.payments[0]?.attributes.paid_at}000`,
  };

  return Object.entries(entry).map(([key, value]) => ({ name: key, value }));
};
