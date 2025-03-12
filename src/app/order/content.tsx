"use client";

import { Suspense, useCallback, useEffect, useMemo } from "react";
import { formatAsMoney, guid } from "@/utils/helpers";
import { OrderProvider, useOrder } from "./ctx";
import { usePaymongo } from "@/hooks/usePaymongo";
import { cn } from "@/lib/utils";
import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";
import { Header, ModButton, ProductImage, Wrapper } from "./components";
import { HyperList } from "@/ui/list";
import { useCartStore } from "../(search)/@ev/components/buttons/cart/useCartStore";
import { Summary } from "./summary";
import type { ItemProps, ListItemProps } from "./types";
import { onError, onInfo, onSuccess } from "../ctx/toast";

export const Content = () => (
  <Suspense>
    <OrderProvider>
      <OrderContent />
    </OrderProvider>
  </Suspense>
);

export const OrderContent = () => {
  const {
    amount,
    itemCount,
    updateCart,
    checkoutSession,
    orderNumber,
    state,
    dispatch,
  } = useOrder();
  const { loading } = usePaymongo();
  const { count, eventId, eventName, userName, userId, price } = useCartStore();

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
          description: "Event Ticket" + userName + userId,
        }) as ItemProps,
    );
    if (items.length > 0) {
      dispatch({ type: "SET", payload: items });
    }
  }, [count, eventId, eventName, price, userId, userName, dispatch]);

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
      await updateCart(state.list.filter((item) => item.quantity !== 0));
      dispatch({ type: "SAVE" });
      onSuccess("Cart updated successfully");
    } catch (error) {
      console.error("Failed to update cart:", error);
      onError("Failed to update cart");
    }
  }, [state.list, updateCart, dispatch]);

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
      await checkoutSession();
    } catch (error) {
      console.error("Checkout failed:", error);
      onError("Checkout failed. Please try again.");
    }
  }, [checkoutSession, saveFn, state.modified]);

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
        <p className="font-ibm px-4 text-xs tracking-wide text-ticket">
          Items list has been modified.
        </p>
        <Button
          size="sm"
          isIconOnly
          className="group rounded-full border-[0.33px] border-primary/60 bg-white"
          onPress={fn.undoFn}
        >
          <Icon name="Undo" className="size-4" />
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

  const items = useMemo(
    () => state.list?.map((item) => ({ ...item, fn })),
    [state.list, fn],
  );

  const LineItems = useCallback(() => {
    return (
      <div className="w-full py-5">
        <div className="mb-4 flex h-8 items-center justify-between px-2">
          <p className="text-xs font-semibold text-ticket">Line Items</p>
          <ModActions />
        </div>
        <HyperList
          container="h-fit w-full overflow-y-scroll scroll-auto rounded-2xl border-[0.33px] border-primary/60 bg-white md:h-[calc(100vh-20rem)]"
          data={items}
          component={Item}
          disableAnimation={items.length === 1}
        />
      </div>
    );
  }, [items, ModActions]);

  return (
    <div className="flex w-full flex-col items-center border-t-[0.33px] border-primary/40 bg-gray-200 py-8">
      <Wrapper>
        <div className="col-span-6 h-fit md:col-span-5 md:h-full lg:col-span-6">
          <Header
            itemCount={newItemCount ?? itemCount}
            amount={formatAsMoney(newAmount ?? amount ?? 0)}
          />
          <LineItems />
        </div>

        <div className="md:col-span-5 lg:col-span-4">
          <Summary
            refNumber={orderNumber}
            state={state}
            updated={Date.now()}
            checkoutFn={checkoutFn}
            loading={loading}
          />
        </div>
      </Wrapper>
    </div>
  );
};

const Item = (props: ListItemProps) => {
  const { name, image, description, quantity, price, id, fn } = props;

  const handleDelete = useCallback(() => {
    if (id) fn.deleteFn(id);
  }, [id, fn]);

  const handleIncrement = useCallback(() => {
    if (id) fn.incrementFn(id);
  }, [id, fn]);

  const handleDecrement = useCallback(() => {
    if (id) fn.decrementFn(id);
  }, [id, fn]);

  return (
    <div
      className={cn(
        "font-ibm group flex h-28 cursor-pointer items-center justify-between transition-all ease-out",
        "border-b border-dotted border-primary/20 px-4",
        { "bg-default/40 px-8 opacity-80 grayscale": quantity === 0 },
      )}
    >
      <div className="flex w-[200px] items-center space-x-6">
        <ProductImage
          alt={`${description}_${name}`}
          src={image}
          quantity={quantity}
        />
        <div
          className={cn("flex w-[240px] flex-col space-y-2 leading-none", {
            "opacity-40": quantity === 0,
          })}
        >
          <div className={cn("h-12 whitespace-nowrap")}>
            <p className="font-inter font-semibold tracking-tight">{name}</p>
            <p className="font-inter text-sm text-gray-600">
              {formatAsMoney(price)}
            </p>
          </div>
          <div className="flex items-center space-x-4 leading-none">
            <p className="font-arc text-[10px] font-light opacity-60">
              Ticket number: {id?.split("-").pop()}
            </p>
          </div>
        </div>
      </div>
      <div className="-mb-3 flex cursor-pointer items-end justify-end md:items-start md:space-x-1 xl:space-x-4">
        <div
          className={cn(
            "invisible -mb-2 flex h-fit items-center space-x-3 rounded-full border-x-[12px] border-white bg-white p-1 opacity-100 group-hover:visible xl:space-x-4",
            { "border-x-10 md:space-x-6": quantity === 0 },
          )}
        >
          <ModButton fn={handleIncrement} icon="Plus" />
          <ModButton
            fn={handleDecrement}
            icon="Minus"
            disabled={quantity === 0}
          />
          <ModButton fn={handleDelete} icon="CloseLight" />
        </div>
      </div>
    </div>
  );
};
