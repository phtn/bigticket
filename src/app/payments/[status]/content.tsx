"use client";

import { Button, Spinner } from "@nextui-org/react";
import { type PaymentDetail, usePayments } from "../usePayments";
import { type PaymentStatus } from "@/lib/paymongo/schema/zod.payments";
import { useMemo } from "react";
import { Iconx } from "@/icons/icon";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";

export const Content = ({
  status,
}: {
  status: PaymentStatus & "cancelled";
}) => {
  const { paymentDetails, isPaid, loading } = usePayments();

  const updatedStatus = useMemo(() => {
    switch (status) {
      case "paid":
        return loading ? "Processing" : isPaid ? "Successful" : "Pending";
      case "fail":
        return loading ? "Processing" : "Failed";
      case "cancelled":
        return loading ? "Processing" : "Cancelled";
      default:
        return "Processing";
    }
  }, [status, loading, isPaid]);

  return (
    <main className="mx-auto h-[calc(100vh-64px)] bg-white p-6">
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-6">
        <div className="mx-auto w-full max-w-md space-y-12 text-center">
          <div className="flex h-24 items-center justify-center">
            <div
              className={cn(
                "rounded-full bg-gray-100 p-2 transition-all duration-700 ease-out",
                {
                  "bg-green-50 p-4": !loading && isPaid,
                  "bg-yellow-50 p-4": !loading && !isPaid,
                },
              )}
            >
              {loading || !isPaid ? (
                <Spinner size="lg" color="secondary" />
              ) : (
                <Iconx
                  name="confirm-circle"
                  strokeWidth={0}
                  className="h-20 w-20 text-secondary"
                />
              )}
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Payment <span className="pl-1">{updatedStatus}</span>
            </h1>
            <p className="mx-auto max-w-sm text-center opacity-60">
              {loading ? (
                "Receivig payment confirmation"
              ) : (
                <span className="animate-enter delay-1000">
                  Payment successfully completed!
                </span>
              )}
            </p>
          </div>

          {loading || !isPaid ? null : (
            <Button
              size="lg"
              color="warning"
              variant={"shadow"}
              className="delay-2000 mx-auto flex animate-enter items-center gap-2 border-gray-300 bg-peach px-16 text-white"
            >
              View Tickets
            </Button>
          )}

          {/* Padding */}
          <div />
        </div>

        <div className="h-[400px] w-80">
          {loading || !isPaid ? null : (
            <div
              className={cn(
                "relative mx-auto h-[400px] w-80 rounded-[40px] border-8 border-coal shadow-xl",
                "duration-2000 delay-3000 translate-y-96 transition-transform",
                { "translate-y-0": !loading },
              )}
            >
              {/* <div className="absolute inset-x-0 top-0 z-10 h-6"> */}
              {/* <div className="absolute left-1/2 top-1.5 h-1 w-16 -translate-x-1/2 transform rounded-full bg-gray-800"></div> */}
              {/* </div> */}
              <div className="absolute inset-0">
                <div className="h-full rounded-2xl bg-gray-900 p-4 pt-8 text-white">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-xs">Transaction Details</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <div className="h-4 w-4 rounded-full border border-white"></div> */}
                      <div className="text-xs">ref no</div>
                    </div>
                  </div>
                  <div>
                    <HyperList
                      data={paymentDetails}
                      component={DetailItem}
                      delay={1}
                      keyId="name"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const DetailItem = (item: PaymentDetail) => (
  <div className="flex h-8 items-center justify-between">
    <div className="flex items-center justify-start">{item.name}</div>
    <div className="flex items-center justify-end">{item.value}</div>
  </div>
);
