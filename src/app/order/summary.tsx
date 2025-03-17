import { HyperList } from "@/ui/list";
import { formatAsMoney } from "@/utils/helpers";
import { Card, CardHeader, Spinner, CardFooter } from "@nextui-org/react";
import { useMemo } from "react";
import type {
  Calc,
  ItemProps,
  SummaryContentProps,
  SummaryProps,
} from "./types";
import { useBase } from "@/hooks/useBase";
import { Iconx } from "@/icons/icon";
import { cn } from "@/lib/utils";
import { useMoment } from "@/hooks/useMoment";

export function Summary({
  refNumber,
  state,
  updated,
  checkoutFn,
  loading,
  userDetails,
}: SummaryProps) {
  const { event_date, compact } = useMoment({ start: updated });

  return (
    <Card className="overflow-hidden border-[0.33px] border-primary bg-primary text-chalk shadow-md shadow-default">
      <CardHeader className="flex h-[96px] w-full rounded-none border-b-[0.33px] border-chalk/20">
        <div className="grid h-[56px] w-full gap-1.5 px-0.5 md:px-2">
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
              {compact ?? (
                <Iconx name="spinners-3-dots-move" className="text-teal-300" />
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
      <CardFooter className="flex items-center rounded-none border-t-[0.33px] border-ticket bg-ticket/60 px-3 py-3 text-white">
        <div className="flex w-full items-center justify-between space-x-2 text-xs text-chalk/60">
          <div className="flex items-center space-x-1">
            <Iconx name="clock" className="size-3.5" />
            <span className="tracking-tight">Last Updated</span>
          </div>
          <span className="tracking-tight">{event_date}</span>
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
  const voucher = 0;
  const taxPct = 12;
  const tax = (calcSubtotal * taxPct) / 100;
  const total = calcSubtotal + tax;

  const calc: Calc[] = useMemo(
    () => [
      { label: "Subtotal", value: calcSubtotal },
      { label: "Discount voucher", value: voucher },
      { label: "Tax (12%)", value: tax },
      { label: "Total", value: total },
    ],
    [calcSubtotal, tax, voucher, total],
  );

  const { chargeHandler, loading: isLoading } = useBase({
    local_price: { amount: (total / 55).toFixed(2), currency: "USDC" },
    pricing_type: "fixed_price",
    metadata: {
      refNumber: refNumber ?? "",
      name: userDetails.userName ?? "",
      email: userDetails.userEmail ?? "",
      phone: userDetails.userPhone ?? "",
    },
  });

  const handleCryptoCheckout = async () => {
    try {
      await chargeHandler();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 pb-4 pt-6 text-xs text-chalk md:p-6">
      <div className="grid gap-x-4 gap-y-6">
        <div className="text-xs font-semibold tracking-tight">Items</div>
        <GroupedLine items={state.list} />
        <Separator />

        <HyperList
          container="grid gap-2"
          itemStyle=" font-inter font-light"
          component={Calculation}
          data={calc}
        />

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Billing Address</div>
            <address className="grid gap-0.5 not-italic opacity-60">
              <span>{userDetails.userName}</span>
              <span>Not set</span>
              <span></span>
            </address>
          </div>
          <div className="grid auto-rows-max gap-3 text-right">
            <div className="flex w-full items-center justify-end font-semibold text-vanilla">
              <button className="flex items-center gap-1 rounded bg-ticket px-1.5 py-0.5">
                <Iconx name="pencil-edit-01" className="size-3" />
                <span>Edit</span>
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
          <div className="flex w-full items-center justify-evenly gap-4">
            <div className="h-20 w-full space-y-4 overflow-visible">
              <div className="flex h-fit w-full justify-start">
                Pay with crypto
              </div>
              <button
                disabled={state.modified}
                onClick={handleCryptoCheckout}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-[0.5rem] border-2 border-[#0052FF] bg-[#0052FF] px-0"
              >
                <Iconx
                  name={isLoading ? "spinner-ring" : "coinbase"}
                  className="size-4"
                  viewBox={isLoading ? `0 0 24 24` : `0 0 48 48`}
                />
                <p className="text-sm font-medium tracking-tight text-white drop-shadow-sm">
                  Pay
                </p>
              </button>
            </div>

            <div className="h-20 w-full space-y-4">
              <div className="flex w-full justify-start whitespace-nowrap">
                Pay with card or ewallets
              </div>
              <button
                disabled={state.modified}
                onClick={paymongoCheckout}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-[0.5rem] border-2 border-white bg-white text-[16px]"
              >
                <div className="flex aspect-square w-[18px] items-center justify-center rounded-full bg-[#002d16]">
                  <Iconx
                    name={loading ? "spinner-ring" : "paymongo-new"}
                    className={cn("size-4 text-[#22B47E]", {
                      "size-[14px] flex-shrink-0 text-[#e5f393]": loading,
                    })}
                    viewBox={loading ? "0 0 24 24" : "0 0 100 100"}
                  />
                </div>
                <span className="text-sm font-medium tracking-tight text-[#002d16]">
                  Checkout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupedLine = ({ items }: { items: ItemProps[] }) => (
  <li className="flex items-center justify-between">
    <div className="flex items-center space-x-2.5">
      <span>{items?.[0]?.name}</span>
      <Iconx name="close" className="size-3 text-orange-300" />
      <span>{items?.length}</span>
    </div>
    <span className="font-inter tracking-widest">
      {formatAsMoney((items?.length ?? 1) * (items?.[0]?.price ?? 1))}
    </span>
  </li>
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
