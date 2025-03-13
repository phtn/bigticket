import { HyperList } from "@/ui/list";
import { formatAsMoney } from "@/utils/helpers";
import {
  Card,
  CardHeader,
  Spinner,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { useMemo, useState, useEffect } from "react";
import type {
  Calc,
  ItemProps,
  SummaryContentProps,
  SummaryProps,
} from "./types";
import { Icon } from "@/icons";
import {
  Checkout,
  CheckoutButton,
  CheckoutStatus,
} from "@coinbase/onchainkit/checkout";
import { useBase } from "@/hooks/useBase";

export function Summary({
  refNumber,
  state,
  updated,
  checkoutFn,
  loading,
  userDetails,
}: SummaryProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");

  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString("en-US", options));
  }, []);

  useEffect(() => {
    if (updated) {
      setFormattedTime(new Date(updated).toLocaleTimeString("en-US", options));
    }
  }, [updated]);

  return (
    <Card className="overflow-hidden border-[0.33px] border-primary bg-primary text-chalk shadow-md shadow-default">
      <CardHeader className="flex h-[96px] w-full rounded-none border-b-[0.33px] border-chalk/20">
        <div className="grid h-[56px] w-full gap-1.5 px-2">
          <div className="flex w-full items-start whitespace-nowrap">
            <div className="flex w-full items-start justify-between text-chalk">
              <p className="font-inter font-extrabold tracking-tight">
                Order Summary
              </p>
              {refNumber ? (
                <div className="animate-enter text-sm">
                  <span className="opacity-80">Ref</span>
                  <span className="pl-3 font-mono font-light tracking-widest text-vanilla">
                    {refNumber}
                  </span>
                </div>
              ) : (
                <Spinner className="ml-2 size-2.5 shrink-0 animate-spin" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs tracking-tight"></div>

          <div className="flex items-center justify-between text-xs tracking-tight">
            <p className="font-medium tracking-normal">Date</p>
            <div className="flex items-center font-light opacity-60">
              {formattedDate ?? (
                <Icon name="SpinnerDotMove" className="text-teal-300" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <SummaryContent
        state={state}
        refNumber={refNumber}
        paymongoCheckout={checkoutFn}
        loading={loading}
        userDetails={userDetails}
      />
      <CardFooter className="flex items-center rounded-none border-t-[0.33px] border-default/20 bg-chalk/70 px-3 py-3 text-primary">
        <div className="flex w-full items-center justify-between space-x-2 text-xs">
          <span className="tracking-tight">Last Updated</span>{" "}
          <span className="font-normal tracking-tight">
            {updated ? (
              formattedTime || "Loading..."
            ) : (
              <Spinner className="size-2.5 shrink-0 animate-spin" />
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

const SummaryContent = ({
  state,
  refNumber,
  paymongoCheckout,
  loading,
  userDetails,
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
  // const shippingCost = -100;
  const voucher = 0;
  const taxPct = 12;
  const tax = (calcSubtotal * taxPct) / 100;
  const total = calcSubtotal + tax;

  const calc: Calc[] = useMemo(
    () => [
      { label: "Subtotal", value: calcSubtotal },
      // {
      //   label: "Shipping " + (shippingCost <= 0 ? `discount` : ``),
      //   value: shippingCost,
      // },
      { label: "Discount voucher", value: voucher },
      { label: "Tax (12%)", value: tax },
      { label: "Total", value: total },
    ],
    [calcSubtotal, tax, voucher, total],
  );

  const { chargeHandler, statusHandler } = useBase({
    local_price: { amount: String(total / 55), currency: "USDC" },
    pricing_type: "fixed_price",
    metadata: {
      refNumber: refNumber ?? "",
      name: userDetails.userName ?? "",
      email: userDetails.userEmail ?? "",
      phone: userDetails.userPhone ?? "",
    },
  });

  return (
    <div className="p-6 text-xs text-chalk">
      <div className="grid gap-x-4 gap-y-6">
        <div className="text-xs font-semibold tracking-tight">Items</div>
        {state.list?.length > 3 ? (
          <GroupedLine items={state.list} />
        ) : (
          <HyperList
            container="grid gap-2"
            data={state.list}
            component={Line}
          />
        )}

        <Separator />

        <HyperList
          container="grid gap-2"
          itemStyle=" font-inter font-light"
          data={calc}
          component={Calculation}
        />

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Billing Address</div>
            <address className="grid gap-0.5 not-italic opacity-60">
              <span>Liam Johnson</span>
              <span>1234 Main St.</span>
              <span>Anytown, CA 12345</span>
            </address>
          </div>
          <div className="grid auto-rows-max gap-3 text-right">
            <div className="flex w-full items-center justify-end font-semibold text-vanilla">
              <button className="flex items-center gap-1 rounded bg-ticket px-1.5 py-0.5">
                <Icon name="Plus" className="" />
                <span>Add new</span>
              </button>
            </div>
            <address className="not-italic opacity-60">
              <div className="">Add another</div>
              <div className="">billing address</div>
            </address>
          </div>
        </div>

        <Separator />

        <div className="">
          <div className="flex w-full items-center justify-evenly gap-8">
            <div className="h-24 max-h-24 w-full overflow-visible">
              <div className="flex h-fit w-full justify-start leading-none">
                Pay with crypto
              </div>
              <Checkout chargeHandler={chargeHandler} onStatus={statusHandler}>
                <CheckoutButton coinbaseBranded />
                <CheckoutStatus />
              </Checkout>
            </div>

            <div className="h-24 w-full space-y-3">
              <div className="flex w-full justify-start whitespace-nowrap">
                Pay with card or ewallets
              </div>
              <Button
                color="primary"
                isDisabled={state.modified}
                isLoading={loading}
                onPress={paymongoCheckout}
                className="h-11 w-full rounded-[0.5rem] border-2 border-secondary bg-primary"
              >
                <p className="text-xs font-medium tracking-tight text-white drop-shadow-sm">
                  Checkout
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupedLine = ({ items }: { items: ItemProps[] }) => (
  <li className="flex items-center justify-between">
    <span className="">
      {items?.[0]?.name}
      <span className="font-arc px-1 text-xs font-light opacity-80">
        x
      </span>{" "}
      <span>{items?.length}</span>
    </span>
    <span className="font-inter tracking-widest">
      {formatAsMoney((items?.length ?? 1) * (items?.[0]?.price ?? 1))}
    </span>
  </li>
);

const Line = (item: ItemProps) => (
  <div className="flex items-center justify-between">
    <span className="">
      {item.name}{" "}
      <span className="font-arc px-1 text-xs font-light opacity-80">x</span>{" "}
      <span>{item.quantity}</span>
    </span>
    <span className="font-arc tracking-wider">
      {formatAsMoney(item.quantity * item.price)}
    </span>
  </div>
);

const Calculation = (calc: Calc) => (
  <div className="flex items-center justify-between last:font-medium">
    <span className="font-normal">{calc.label}</span>
    <span className="tracking-widest">{formatAsMoney(calc.value)}</span>
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

const Separator = () => (
  <div className="my-2.5 h-px border-b border-dotted border-ticket" />
);

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
