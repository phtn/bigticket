import { type PaymentIntentResource } from "@/lib/paymongo/schema/zod.payment-intent";
import { retrievePaymentIntent } from "@/server/api/callers/paymongo";
import { Err, formatAsMoney, guid } from "@/utils/helpers";
import { api } from "@vx/api";
import { type UserTicket } from "convex/events/d";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../ctx/auth/provider";

interface BigTicketTransaction {
  type: "paymongo" | "base";
  cs: number;
  pi: string;
}

export interface PaymentDetail {
  name: string;
  value: string | number | boolean | undefined | null;
}

export const usePayments = (product?: string) => {
  const [paymentIntent, setPaymentIntent] =
    useState<PaymentIntentResource | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>();
  const [isProcessing, setProcessing] = useState<boolean>(true);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [ticketsAdded, setTicketsAdded] = useState<boolean>(false);

  const getPaymentStatus = useCallback(
    async (id: string) => await retrievePaymentIntent({ id }),
    [],
  );

  useEffect(() => {
    const txn = localStorage.getItem("bigticket_txn");

    if (!txn) {
      setProcessing(false);
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
            setProcessing(false);
          });
      } else {
        // TODO: Implement payment status for other payment methods (base)
        setProcessing(false);
      }
    } catch (error) {
      console.error(error);
      setProcessing(false);
    }
  }, [getPaymentStatus]);

  const saveFn = useMutation(api.transactions.create.default);
  const updateUserTickets = useMutation(api.users.update.tickets);
  const { user } = useAuth();

  const tkts = localStorage.getItem("bigticket_tkts");
  const tktd = localStorage.getItem("bigticket_tktd");

  const parsedTicketD = tktd && (JSON.parse(tktd) as { ticket_count: number });
  const parsedTickets = tkts && (JSON.parse(tkts) as UserTicket);

  useEffect(() => {
    if (paymentIntent && user) {
      setIsPaid(paymentIntent.attributes.status === "succeeded");
      setPaymentDetails(createPaymentDetails(paymentIntent));

      const saveTransaction = async () => {
        try {
          if (parsedTickets && parsedTicketD) {
            await saveFn({
              txn_id: paymentIntent.id.substring(3),
              user_id: user.id,
              product_name: parsedTickets.event_name,
              product_type: product ?? "ticket",
              quantity: parsedTicketD.ticket_count,
              type: paymentIntent.attributes.payments[0]?.type,
              amount: parseFloat(
                (paymentIntent.attributes.amount / 100).toFixed(2),
              ),
              mode: paymentIntent.attributes.payments[0]?.attributes.source
                .type,
              currency: paymentIntent.attributes.currency,
              status: paymentIntent.attributes.status,
              ref_no:
                paymentIntent.attributes.payments[0]?.attributes.description,
            });
          }
        } catch (error) {
          console.error(error);
        }
      };

      saveTransaction().catch(Err);
    }
  }, [paymentIntent, saveFn, user, parsedTicketD, parsedTickets, product]);

  useEffect(() => {
    if (!product && parsedTicketD && parsedTickets && user) {
      const tickets = Array.from({
        length: parsedTicketD.ticket_count,
      }).map(
        () =>
          ({
            ...parsedTickets,
            event_url: `https://bigticket.ph/x?=${parsedTickets.event_id}`,
            ticket_count: parsedTicketD.ticket_count,
            ticket_id: guid(),
          }) as UserTicket,
      );
      updateUserTickets({
        id: user.id,
        tickets,
      })
        .then(() => {
          setTicketsAdded(true);
        })
        .catch(Err);
    }
  }, [parsedTicketD, user, parsedTickets, product, updateUserTickets]);

  return {
    paymentDetails,
    isProcessing,
    ticketsAdded,
    parsedTicketD,
    parsedTickets,
    isPaid,
  };
};

const createPaymentDetails = (paymentIntent: PaymentIntentResource) => {
  const { attributes } = paymentIntent;

  const entry = {
    amount: `${attributes.currency} ${formatAsMoney(attributes.amount / 100, 2)}`,
    type: paymentIntent.attributes.payments[0]?.type,
    refNo: attributes.description,
    status: attributes.payments[0]?.attributes.status,
    mode: attributes.payments[0]?.attributes.source.type,
    source: attributes.payments[0]?.attributes.source.id.substring(4, 10),
    date: +`${attributes.payments[0]?.attributes.paid_at}000`,
  };

  return Object.entries(entry).map(([key, value]) => ({ name: key, value }));
};
