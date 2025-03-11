"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { formatAsMoney } from "@/utils/helpers";
import { reducer, type ReducerState } from "./reducer";
import { type ItemProps, useOrder } from "./ctx";
import { usePaymongo } from "@/hooks/usePaymongo";
import { cn } from "@/lib/utils";
import { Icon } from "@/icons";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import {
  Header,
  Label,
  type ListItem,
  type ListItemProps,
  ModButton,
  ProductImage,
  Wrapper,
} from "./components";
import { HyperList } from "@/ui/list";
import { useCartStore } from "../(search)/@ev/components/buttons/cart/useCartStore";

export const Content = () => {
  const initialState = {
    list: [],
    modified: false,
    history: [],
  };

  const { amount, itemCount, updateCart, params, itemList } = useOrder();

  const { loading, checkout } = usePaymongo();

  const [state, dispatch] = useReducer(reducer, initialState);

  const { count, eventName, userName, userId, price } = useCartStore();
  useEffect(() => {
    const items = Array.from({ length: count }).map(
      (_, i) =>
        ({
          id: i,
          name: eventName,
          amount: price,
          price: price,
          quantity: 1,
          currency: "PHP",
          image: "",
          description: "Event Ticket" + userName + userId,
        }) as ItemProps,
    );
    dispatch({ type: "SET", payload: items });
    console.log(items);
  }, [itemList, count, eventName, price, userId, userName]);

  const incrFn = useCallback((name: string) => {
    dispatch({ type: "INCREMENT", payload: { name } });
  }, []);

  const decrFn = useCallback((name: string) => {
    dispatch({ type: "DECREMENT", payload: { name } });
  }, []);

  const deleteFn = useCallback((name: string) => {
    dispatch({ type: "DELETE", payload: { name } });
  }, []);

  const saveFn = useCallback(async () => {
    if (!state.list) return;
    await updateCart(state.list.filter((item) => item.quantity !== 0));
    dispatch({ type: "SAVE" });
  }, [state.list, updateCart]);

  const cancelFn = useCallback(() => {
    if (!state.list) return;
    dispatch({ type: "CANCEL" });
  }, [state.list]);

  const undoFn = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const handleCheckout = useCallback(async () => {
    if (state.modified) {
      await saveFn().then(async () => {
        await checkout(params);
      });
    } else {
      await checkout(params);
    }
  }, [checkout, saveFn, state.modified, params]);

  const fn = useMemo(
    () => ({ cancelFn, decrFn, deleteFn, incrFn, saveFn, undoFn }),
    [cancelFn, decrFn, deleteFn, incrFn, saveFn, undoFn],
  );

  const newItemCount = state.list?.reduce(
    (acc, cur) => (acc += cur.quantity),
    0,
  );

  const newAmount = useMemo(
    () =>
      state.list?.reduce((acc, cur) => (acc += cur.quantity * +cur.amount), 0),
    [state.list],
  );

  const categories = state.list?.map(
    (item) => item.description?.split("--")[1]?.split("|>")[6],
  );

  const ModActions = useCallback(
    () => (
      <div
        className={cn("flex items-center space-x-2 text-gray-800", {
          hidden: !state.modified,
        })}
      >
        <p className="font-ibm px-4 text-xs italic tracking-wide opacity-60">
          Your list has been modified.
        </p>
        <Button
          size="sm"
          isIconOnly
          color="secondary"
          className="group rounded-full border-[0.33px] border-gray-400 bg-default/80"
          onPress={fn.undoFn}
        >
          <Icon name="ArrowRight" className="text-gray-800" />
        </Button>
        <Button
          size="sm"
          color="warning"
          isDisabled={loading}
          onPress={fn.cancelFn}
          className="rounded-full border-[0.33px] border-gray-400 bg-default/80 tracking-tight text-gray-800"
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

  const ItemList = useCallback(
    ({ render }: ListItemProps) => {
      return (
        <div className="w-full py-6">
          <div className="mb-4 flex h-8 items-center justify-between px-2">
            <Label>Item Details</Label>
            <ModActions />
          </div>
          <div
            className={cn(
              "h-[calc(100vh-16rem)] w-full overflow-y-scroll scroll-auto",
            )}
          >
            {state.list?.map((item, i) => <div key={i}>{render(item)}</div>)}
          </div>
        </div>
      );
    },
    [state, ModActions],
  );

  const render = useCallback(
    (item: ItemProps) => <Item itemProps={item} fn={fn} />,
    [fn],
  );

  return (
    <div className="flex w-full flex-col items-center border border-t bg-white">
      <div className="w-full bg-white py-4"></div>
      <Wrapper>
        <div className="col-span-6">
          <Header
            itemCount={newItemCount ?? itemCount}
            amount={formatAsMoney(newAmount ?? amount! ?? 0) ?? 0}
            categories={categories}
            list={state.list}
            subtotal={newAmount}
          />
          <ItemList fn={fn} loading={loading} render={render} />
        </div>

        <div className="md:col-span-10 xl:col-span-4">
          <Summary
            refNumber={"69"}
            state={state}
            updated={Date.now()}
            checkoutFn={handleCheckout}
            loading={loading}
          />
        </div>
      </Wrapper>
    </div>
  );
};

const Item = ({ itemProps }: ListItem) => {
  const { name, description, quantity, price } = itemProps;
  // const handleIncr = () => {
  //   fn.incrFn(productName!);
  // };
  // const handleDecr = () => {
  //   fn.decrFn(productName!);
  // };
  // const handleDelete = () => {
  //   fn.deleteFn(productName!);
  // };
  return (
    <div
      className={cn(
        "font-ibm group flex h-28 cursor-pointer items-center justify-between transition-all ease-out",
        "border-b border-dotted border-default-400/60 px-0",
        { "bg-default/40 px-6 grayscale": quantity === 0 },
      )}
    >
      <div className="flex items-center space-x-6">
        <ProductImage
          alt={`${description}_${name}`}
          src={name}
          quantity={quantity}
        />
        <div
          className={cn("flex flex-col space-y-2 leading-none", {
            "opacity-40": quantity === 0,
          })}
        >
          <div className={cn("h-12 whitespace-nowrap")}>
            <p className="font-ibm text-lg font-medium tracking-tight">
              {name}{" "}
              <span className="text-xs font-medium tracking-wide opacity-80">
                <span className="pl-1 pr-0.5 text-[10px] italic tracking-tight">
                  by
                </span>
                {"branc "}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-4 leading-none">
            <p className="font-arc text-sm font-light">
              {formatAsMoney(price)}
            </p>
            <p className="font-ibm rounded border-[0.33px] border-default-400/60 bg-default-100 px-0.5 py-[1.5px] text-[10px] uppercase text-default-500"></p>
            <p className="font-arc text-[10px] font-light opacity-60"></p>
            <p className="font-arc text-[10px] font-light opacity-60"></p>
          </div>
        </div>
      </div>
      <div className="flex cursor-pointer items-start justify-end md:space-x-1 xl:space-x-4">
        <div
          className={cn(
            "invisible flex h-fit items-center rounded-full border-x-[12px] border-white bg-white p-2 opacity-100 group-hover:visible md:space-x-3 xl:space-x-4",
            { "border-x-10 space-x-6": quantity === 0 },
          )}
        >
          <ModButton fn={() => ({})} icon={"Plus"} />
          <ModButton fn={() => ({})} icon={"Minus"} disabled={quantity === 0} />
          <ModButton
            fn={() => ({})}
            icon={"ArrowRightDouble"}
            disabled={quantity === 0}
          />
        </div>
        <div
          className={cn(
            "flex w-fit min-w-[64px] flex-col items-end justify-center whitespace-nowrap",
            { "opacity-40": quantity === 0 },
          )}
        >
          <Label>amount</Label>
          <p className="font-arc font-medium">
            {price && formatAsMoney(+price * quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};

interface SummaryProps {
  refNumber: string | null;
  state: ReducerState;
  updated: number | undefined;
  checkoutFn: VoidFunction;
  loading: boolean;
}

function Summary({
  refNumber,
  state,
  updated,
  checkoutFn,
  loading,
}: SummaryProps) {
  const event = new Date();

  const rfn = refNumber?.split("-");
  const [refA, refB] = [rfn?.[1]?.slice(0, 4), rfn?.[1]?.slice(4)];

  return (
    <Card className="overflow-hidden rounded-none border-[0.33px] border-default-400/80 bg-default/20 shadow-md shadow-default">
      <CardHeader className="flex w-full rounded-none border-b-[0.33px] border-default-400/60">
        <div className="grid h-[72px] w-full gap-1.5 px-2">
          <div className="flex w-full items-start whitespace-nowrap">
            <div className="flex items-center space-x-2 font-inter font-semibold tracking-tight text-gray-800">
              <p>Order Summary</p>
            </div>
          </div>
          <div className="font-ibm flex items-center justify-between text-xs tracking-tight">
            <p className="pr-2 font-light tracking-normal">Order Id:</p>
            {refNumber ? (
              <p className="animate-enter font-medium tracking-wider text-default-700">
                {rfn?.[0]}
                <span className="px-2">{refA}</span>
                {refB}
              </p>
            ) : (
              <Spinner className="ml-2 size-2.5 shrink-0 animate-spin" />
            )}
          </div>

          <div className="font-ibm flex items-center justify-between text-xs tracking-tight">
            <p className="pr-2 font-light tracking-normal">Date:</p>
            <p>
              <span className="font-ibm font-light">
                {event.toLocaleDateString("en-US", options)}
              </span>
            </p>
          </div>
        </div>
      </CardHeader>
      <SummaryContent state={state} onCheckout={checkoutFn} loading={loading} />
      <CardFooter className="font-ibm flex flex-row items-center rounded-none border-t-[0.33px] border-default-400/60 bg-default/60 px-6 py-3">
        <div className="flex items-center space-x-2 text-xs text-default-500">
          <span className="font-semibold">Last Updated</span>{" "}
          <span className="font-light">
            {updated ? (
              new Date(updated).toLocaleTimeString("en-US", options)
            ) : (
              <Spinner className="size-2.5 shrink-0 animate-spin" />
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

interface Calc {
  label: string;
  value: number;
}
interface SummaryContentProps {
  state: ReducerState;
  onCheckout: VoidFunction;
  loading: boolean;
}
const SummaryContent = ({
  state,
  onCheckout,
  loading,
}: SummaryContentProps) => {
  const subtotal = useMemo(
    () => state.list?.reduce((acc, cur) => (acc += cur.amount), 0),
    [state],
  );
  const newSubtotal = state.list?.reduce(
    (acc, cur) => (acc += cur.quantity * +cur.amount),
    0,
  );

  const calcSubtotal = newSubtotal ?? subtotal;
  const shippingCost = -100;
  const voucher = -200;
  const taxPct = 12;
  const tax = (calcSubtotal * taxPct) / 100;
  const total = calcSubtotal + shippingCost + tax;

  const calc: Calc[] = useMemo(
    () => [
      { label: "Subtotal", value: calcSubtotal },
      {
        label: "Shipping " + (shippingCost <= 0 ? `discount` : ``),
        value: shippingCost,
      },
      { label: "Voucher discount", value: voucher },
      { label: "Tax (12%)", value: tax },
      { label: "Total", value: total },
    ],
    [calcSubtotal, shippingCost, tax, voucher, total],
  );

  return (
    <div className="font-ibm p-6 text-xs text-gray-800">
      <div className="grid gap-x-4 gap-y-6">
        <div className="font-inter text-xs font-semibold tracking-tight">
          Items
        </div>
        <ul className="grid gap-2">
          {state.list?.map((item) => (
            <li key={item.name} className="flex items-center justify-between">
              <span className="">
                {item.name}{" "}
                <span className="font-arc px-1 text-xs font-light opacity-80">
                  x
                </span>{" "}
                <span>{item.quantity}</span>
              </span>
              <span className="font-arc tracking-wider">
                {formatAsMoney(item.quantity * item.price)}
              </span>
            </li>
          ))}
        </ul>

        <div className="my-3 h-[2px] border-b-[0.33px] border-dashed border-default-400" />

        <HyperList
          container="grid gap-2"
          itemStyle=" font-inter font-light"
          data={calc}
          component={Calculation}
        />

        <div className="my-3 h-[2px] border-b-[0.33px] border-dashed border-default-400" />

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Shipping Information</div>
            <address className="grid gap-0.5 not-italic">
              <span>Liam Johnson</span>
              <span>1234 Main St.</span>
              <span>Anytown, CA 12345</span>
            </address>
          </div>
          <div className="grid auto-rows-max gap-3 text-right">
            <div className="font-semibold">Billing Information</div>
            <div className="">Same as shipping address</div>
          </div>
        </div>

        <div className="my-3 h-[2px] border-b-[0.33px] border-dashed border-default-400" />

        <div className="grid gap-4">
          <div className="flex items-center">
            <Button
              size="lg"
              color="primary"
              variant="shadow"
              isDisabled={state.modified}
              isLoading={loading}
              onPress={onCheckout}
              className="mx-4 w-full"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calculation = (calc: Calc) => (
  <div className="flex items-center justify-between last:font-semibold">
    <span className="font-normal">{calc.label}</span>
    <span className="font-arc tracking-wider">{formatAsMoney(calc.value)}</span>
  </div>
);

export const CustomerInfo = () => (
  <div className="grid gap-1">
    <div className="font-semibold">Customer Information</div>
    <dl className="grid gap-1">
      <div className="flex items-center justify-between">
        <dt className="">Customer</dt>
        <dd>Liam Johnson</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="">Email</dt>
        <dd>
          <a href="mailto:">liam@acme.com</a>
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="">Phone</dt>
        <dd>
          <a href="tel:">+1 234 567 890</a>
        </dd>
      </div>
    </dl>
  </div>
);

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
