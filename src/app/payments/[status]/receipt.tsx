import {
  type IMenuItem,
  PopOptions,
} from "@/app/account/(tabs)/events/components";
import { BtnIcon } from "@/ui/button";
import { useCallback } from "react";
import { type PaymentDetail } from "../usePayments";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Image } from "@nextui-org/react";
import moment from "moment";

interface ReceiptProps {
  data: PaymentDetail[] | undefined;
  shareFn: () => Promise<void>;
  downloadFn: () => Promise<void>;
  loading: boolean;
}

export const Receipt = ({
  data,
  shareFn,
  downloadFn,
  loading,
}: ReceiptProps) => {
  const ShareOptions = useCallback(() => {
    const handleAction = async (action: string) => {
      switch (action) {
        case "share":
          await shareFn();
          break;
        case "download":
          await downloadFn();
          break;
        default:
          break;
      }
    };

    const menu = [
      {
        id: 1,
        type: "action",
        label: "Share",
        value: "share",
        icon: "share",
      },
      {
        id: 2,
        type: "action",
        label: "Download",
        value: "download",
        icon: "download",
      },
    ] as IMenuItem[];

    return (
      <PopOptions menu={menu} onAction={handleAction}>
        <section className="flex w-6 items-center justify-center">
          <BtnIcon
            icon="share"
            bg="text-chalk opacity-0"
            color="text-sky-400"
          />
        </section>
      </PopOptions>
    );
  }, [shareFn, downloadFn]);
  return (
    <div
      className={cn(
        "relative mx-auto h-[420px] w-[346px] rounded-[40px] border-8 border-coal shadow-xl",
        "duration-2000 delay-3000 translate-y-96 transition-transform",
        { "translate-y-0": !loading },
      )}
    >
      <div className="absolute inset-0">
        <div className="h-full rounded-3xl bg-gray-900 p-4 pt-8 text-white">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold tracking-tight text-gray-300">
                Transaction Details
              </div>
            </div>
            <div className="flex items-center gap-2 text-macd-blue">
              <ShareOptions />
            </div>
          </div>
          <div>
            <HyperList
              data={data}
              component={DetailItem}
              delay={1}
              keyId="name"
            />
          </div>
          <div
            className={cn(
              "hidden h-14 w-full items-center justify-center space-x-2",
              { flex: data },
            )}
          >
            <Image
              alt="big-ticket-logomark"
              src="/api/logo"
              className="aspect-square size-5"
            />
            <p className="text-[10px] opacity-80">
              <span className="pr-1.5">&copy;{new Date().getFullYear()}</span>
              Big Ticket
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = (item: PaymentDetail) => (
  <div className="flex h-10 items-center justify-between border-b-[0.33px] border-dashed border-ticket/80">
    <div className="flex items-center justify-start text-xs capitalize opacity-60">
      {item.name}
    </div>
    <div className="flex items-center justify-end text-sm uppercase text-chalk">
      {item.name === "date"
        ? moment(item.value as number).format("lll")
        : item.value}
    </div>
  </div>
);
