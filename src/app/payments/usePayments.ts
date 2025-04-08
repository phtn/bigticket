"use client";

import { type PaymentIntentResource } from "@/lib/paymongo/schema/zod.payment-intent";
import { retrievePaymentIntent } from "@/server/api/callers/paymongo";
import { Err, formatAsMoney, guid } from "@/utils/helpers";
import { api } from "@vx/api";
import { type UserTicket } from "convex/events/d";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../ctx/auth/provider";
import { getPaymentId, storePaymentId } from "./[status]/actions";

// Move interfaces to separate types file if they're used elsewhere
interface BigTicketTransaction {
  type: "paymongo" | "base";
  cs: number;
  pi: string;
}

export interface PaymentDetail {
  name: string;
  value: string | number | boolean | undefined | null;
}

export const usePayments = (product?: string, status?: string) => {
  const [paymentIntent, setPaymentIntent] =
    useState<PaymentIntentResource | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
  const [isProcessing, setProcessing] = useState<boolean>(true);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [ticketsAdded, setTicketsAdded] = useState<boolean>(false);
  const [storedData, setStoredData] = useState<{
    transaction: BigTicketTransaction | null;
    tickets: UserTicket;
    ticketDetails: { ticket_count: number };
  } | null>(null);
  const [tickets, setTickets] = useState<UserTicket[] | null>(null);

  useEffect(() => {
    if (status === "cancelled") {
      // Handle cancelled status
      setProcessing(false);
      return;
    }
  }, [status]);

  const { user } = useAuth();
  const saveFn = useMutation(api.transactions.create.default);
  const updateUserTickets = useMutation(api.users.update.tickets);

  useEffect(() => {
    const txn = localStorage.getItem("bigticket_txn");
    const tkts = localStorage.getItem("bigticket_tkts");
    const tktd = localStorage.getItem("bigticket_tktd");
    setStoredData({
      transaction: txn ? (JSON.parse(txn) as BigTicketTransaction) : null,
      tickets: JSON.parse(tkts!) as UserTicket,
      ticketDetails: JSON.parse(tktd!) as { ticket_count: number },
    });
  }, []);

  const getPaymentStatus = useCallback(async (id: string) => {
    try {
      return await retrievePaymentIntent({ id });
    } catch (error) {
      console.error("Failed to retrieve payment intent:", error);
      return null;
    }
  }, []);

  // const handleTicketAddStatus = useCallback(() => {
  //   setTicketsAdded(true);
  // }, []);

  // Handle initial payment status check
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!storedData?.transaction) {
        setProcessing(false);
        return;
      }

      if (storedData.transaction.type === "paymongo") {
        try {
          const intent = await getPaymentStatus(storedData.transaction.pi);
          setPaymentIntent(intent);
        } catch (error) {
          console.error("Payment status check failed:", error);
        }
      }
      setProcessing(false);
    };

    checkPaymentStatus().catch(Err);
  }, [storedData?.transaction, getPaymentStatus]);

  useEffect(() => {
    if (paymentIntent) {
      setIsPaid(paymentIntent.attributes.status === "succeeded");
      setPaymentDetails(createPaymentDetails(paymentIntent));
    }
  }, [paymentIntent]);

  const saveTransaction = useCallback(async () => {
    try {
      if (!user || !paymentIntent) return;
      await saveFn({
        txn_id: paymentIntent.id.substring(3),
        user_id: user.id,
        product_name: storedData?.tickets?.event_name,
        product_type: product ?? "ticket",
        quantity: storedData?.ticketDetails?.ticket_count,
        type: paymentIntent.attributes.payments[0]?.type,
        amount: parseFloat((paymentIntent.attributes.amount / 100).toFixed(2)),
        mode: paymentIntent.attributes.payments[0]?.attributes.source.type,
        currency: paymentIntent.attributes.currency,
        status: paymentIntent.attributes.status,
        ref_no: paymentIntent.attributes.payments[0]?.attributes.description,
      });
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  }, [user, paymentIntent, product, saveFn, storedData]);

  useEffect(() => {
    saveTransaction().catch(Err);
  }, [saveTransaction]);

  // Handle ticket creation and update
  useEffect(() => {
    if (!product && !ticketsAdded && storedData && user) {
      const t = Array.from({
        length: storedData?.ticketDetails?.ticket_count,
      }).map(() => ({
        ...storedData.tickets,
        event_url: `https://bigticket.ph/x?=${storedData.tickets.event_id}`,
        ticket_count: storedData?.ticketDetails?.ticket_count,
        ticket_id: guid(),
      }));

      setTickets(t);
    }
  }, [user, product, storedData, updateUserTickets, ticketsAdded]);

  const addUserTickets = useCallback(async () => {
    if (!paymentIntent) return;
    const storedPaymentId = await getPaymentId();
    const matchedId = storedPaymentId === paymentIntent.id;
    if (user && !matchedId) {
      if (tickets && tickets.length > 0) {
        await updateUserTickets({ id: user.id, tickets });
        localStorage.removeItem("bigticket_txn");
        localStorage.removeItem("bigticket_tkts");
        localStorage.removeItem("bigticket_tktd");
        localStorage.removeItem("bigticket_csp");
        localStorage.removeItem("bigticket_pcs");
        localStorage.removeItem("bigticket_cart");
        setTickets(null);
        setTicketsAdded(true);
        storePaymentId(paymentIntent.id).catch(console.error);
      }
    } else {
      setProcessing(false);
    }
  }, [user, paymentIntent, tickets, updateUserTickets]);

  useEffect(() => {
    addUserTickets().catch(Err);
  }, [addUserTickets]);

  return {
    paymentDetails,
    isProcessing,
    ticketsAdded,
    parsedTicketD: storedData?.ticketDetails,
    parsedTickets: storedData?.tickets,
    isPaid,
  };
};

// Move to a separate utils file if used elsewhere
const createPaymentDetails = (
  paymentIntent: PaymentIntentResource,
): PaymentDetail[] => {
  const { attributes } = paymentIntent;
  const payment = attributes.payments[0]?.attributes;

  const entry = {
    amount: `${attributes.currency} ${formatAsMoney(attributes.amount / 100, 2)}`,
    type: paymentIntent.attributes.payments[0]?.type,
    refNo: attributes.description,
    status: payment?.status,
    mode: payment?.source.type,
    source: payment?.source.id.substring(4, 10),
    date: payment?.paid_at ? +`${payment.paid_at}000` : undefined,
  };

  return Object.entries(entry).map(([key, value]) => ({ name: key, value }));
};
