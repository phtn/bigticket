"use client";

import { useMoment } from "@/hooks/useMoment";
import { usePaymongo } from "@/hooks/usePaymongo";
import { cn } from "@/lib/utils";
import { guid } from "@/utils/helpers";
import { Button } from "@nextui-org/react";
import { Suspense, useCallback, useEffect, useMemo } from "react";
import { useCartStore } from "../(search)/@ev/components/buttons/cart/useCartStore";
import { onError, onInfo, onSuccess } from "../ctx/toast";
import { CartItem, Header, Wrapper } from "./components";
import { OrderProvider, useOrder } from "./ctx";
import { Summary } from "./summary";
import type { ItemProps } from "./types";
import { Iconx } from "@/icons/icon";
import { moses, secureRef } from "@/utils/crypto";
import { useRouter, useSearchParams } from "next/navigation";

interface OrderContentProps {
  node_env: boolean;
}

export const Content = ({ node_env }: OrderContentProps) => (
  <Suspense>
    <OrderProvider node_env={node_env}>
      <OrderContent />
    </OrderProvider>
  </Suspense>
);

export const OrderContent = () => {
  const {
    amount,
    itemCount,
    updateCart,
    createCheckoutSession,
    orderNumber,
    loading: paymongoLoading,
    state,
    dispatch,
  } = useOrder();
  const { loading } = usePaymongo();
  const {
    count,
    eventId,
    eventDate,
    eventOrganizer,
    eventVenue,
    eventName,
    price,
    userName,
    userEmail,
    userPhone,
  } = useCartStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const userDetails = useMemo(
    () => ({ userName, userEmail, userPhone }),
    [userName, userEmail, userPhone],
  );

  const { event_date } = useMoment({ start: eventDate });

  const description = useMemo(
    () => descriptor(eventVenue, event_date, eventOrganizer),
    [eventVenue, event_date, eventOrganizer],
  );

  useEffect(() => {
    const imageKey = localStorage.getItem(`cover_${eventId}`);
    const image = imageKey
      ? (JSON.parse(imageKey) as { cover_src: string })
      : null;
    const items = Array.from({ length: count }).map(
      (_) =>
        ({
          id: guid(),
          name: eventName,
          amount: price,
          price: price,
          quantity: 1,
          currency: "PHP" as const,
          image: image?.cover_src,
          description,
        }) as ItemProps,
    );
    if (items.length > 0) {
      dispatch({ type: "SET", payload: items });
    }
  }, [count, eventId, eventName, price, dispatch, description]);

  const incrementFn = useCallback(
    (id: string) => {
      dispatch({ type: "INCREMENT", payload: { id } });
    },
    [dispatch],
  );

  const decrementFn = useCallback(
    (id: string) => {
      dispatch({ type: "DECREMENT", payload: { id } });
    },
    [dispatch],
  );

  const deleteFn = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE", payload: { id } });
    },
    [dispatch],
  );

  const saveFn = useCallback(async () => {
    if (!state.list) return;
    try {
      const stale_pcs = localStorage.getItem("bigticket_pcs");
      if (stale_pcs) {
        localStorage.removeItem("bigticket_pcs");
        const refNo = moses(("b" + secureRef(8) + "t").toUpperCase());
        const params = new URLSearchParams(searchParams.toString());
        params.set("r", refNo);
        router.replace(`?${params.toString()}`);
      }
      await updateCart(state.list.filter((item) => item.quantity !== 0));
      dispatch({ type: "SAVE" });
      onSuccess("Cart updated successfully");
    } catch (error) {
      console.error("Failed to update cart:", error);
      onError("Failed to update cart");
    }
  }, [state.list, updateCart, dispatch, router, searchParams]);

  const cancelFn = useCallback(() => {
    if (!state.list) return;
    dispatch({ type: "CANCEL" });
    onInfo("Changes cancelled");
  }, [state.list, dispatch]);

  const undoFn = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, [dispatch]);

  const checkoutFn = useCallback(async () => {
    try {
      if (state.modified) {
        await saveFn();
      }
      await createCheckoutSession();
    } catch (error) {
      console.error("Checkout failed:", error);
      onError("Checkout failed. Please try again.");
    }
  }, [createCheckoutSession, saveFn, state.modified]);

  const fn = useMemo(
    () => ({ cancelFn, decrementFn, deleteFn, incrementFn, saveFn, undoFn }),
    [cancelFn, decrementFn, deleteFn, incrementFn, saveFn, undoFn],
  );

  const newItemCount = useMemo(
    () => state.list?.reduce((acc, cur) => acc + cur.quantity, 0) ?? 0,
    [state.list],
  );

  const newAmount = useMemo(
    () =>
      state.list?.reduce((acc, cur) => acc + cur.quantity * cur.price, 0) ?? 0,
    [state.list],
  );

  const ModActions = useCallback(
    () => (
      <div
        className={cn("flex items-center space-x-2", {
          hidden: !state.modified,
        })}
      >
        <Button
          size="sm"
          isIconOnly
          className="group rounded-full border-[0.33px] border-primary/60 bg-white"
          onPress={fn.undoFn}
        >
          <Iconx name="arrow-turn-up" className="size-4 -rotate-90" />{" "}
        </Button>
        <Button
          size="sm"
          isDisabled={loading}
          onPress={fn.cancelFn}
          className="rounded-full border-[0.33px] border-primary/60 bg-white tracking-tight"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          isLoading={loading}
          size="sm"
          onPress={fn.saveFn}
          className="rounded-full"
        >
          Save
        </Button>
      </div>
    ),
    [fn.cancelFn, fn.saveFn, fn.undoFn, loading, state.modified],
  );

  const LineItems = useCallback(() => {
    return (
      <div className="w-full py-5">
        <div className="mb-4 flex h-8 items-center justify-between px-2">
          <p className="text-xs font-semibold tracking-tight text-ticket">
            Line Items
          </p>
          <ModActions />
        </div>
        <CartItem item={state.list[0]} quantity={itemCount} fn={fn} />
      </div>
    );
  }, [ModActions, fn, itemCount, state.list]);

  return (
    <Wrapper>
      <div className="col-span-6 h-fit md:col-span-5 md:h-full lg:col-span-6">
        <Header
          itemCount={newItemCount ?? itemCount}
          total={newAmount ?? amount ?? 0}
        />
        <LineItems />
      </div>

      <div className="md:col-span-5 lg:col-span-4">
        <Summary
          refNumber={orderNumber}
          state={state}
          updated={Date.now()}
          checkoutFn={checkoutFn}
          loading={paymongoLoading}
          userDetails={userDetails}
        />
      </div>
    </Wrapper>
  );
};

const descriptor = (
  venue: string | undefined,
  date: string | undefined,
  org: string | undefined,
) => {
  return `${venue}|>${date}|>(${org})`;
};
