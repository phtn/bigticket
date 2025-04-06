"use client";

import { DynamicProxima } from "@/app/_components_/proxima";
import { getUserEmail } from "@/app/actions";
import { useConvexCtx } from "@/app/ctx/convex";
import { onInfo } from "@/app/ctx/toast";
import { Iconx } from "@/icons";
import { cn } from "@/lib/utils";
import { Button, Spinner } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export const Content = ({ id }: { id: string }) => {
  const { vxEvents } = useConvexCtx();

  const searchParams = useSearchParams();
  const eventId = searchParams.get("x");
  const encoded = searchParams.get("e");
  const isCohost = searchParams.get("cohost");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateCohost = useCallback(async () => {
    const decoded = encoded && Buffer.from(encoded, "base64").toString();
    const email = await getUserEmail();
    if (!email) {
      onInfo("Please sign in to confirm as co-host");
      return;
    }
    if (!decoded || !eventId || !isCohost) return;
    const confirm = vxEvents.mut.updateCohostConfirmation({
      id: eventId,
      email: decoded,
    });
    await toast
      .promise(confirm, {
        loading: "Confirming co-host...",
        success: "You've confirmed as co-host!",
        error: "Failed to confirm co-host",
      })
      .then(() => {
        setLoading(true);
        router.push("/account/events");
      });
  }, [vxEvents.mut, encoded, eventId, router, isCohost]);

  const ConfirmationCard = () => {
    switch (id) {
      case "cohosted":
        return <Cohosted confirmFn={updateCohost} loading={loading} />;
      case "2":
        return <div>Case 2</div>;
      default:
        return <div>Default</div>;
    }
  };
  return (
    <div className="border-t border-macl-gray">
      <main className="flex justify-center p-20">
        <ConfirmationCard />
      </main>
      <div
        className={cn(
          "flex w-0 origin-center items-center justify-center font-inter text-lg font-black uppercase opacity-0",
          "text-macl-orange transition-all duration-300",
          { "w-full border bg-primary opacity-100": loading },
        )}
      >
        Confirmed
      </div>

      <div className="pt-64">
        <DynamicProxima className="text-primary" />
      </div>
    </div>
  );
};

interface ConfirmProps {
  confirmFn: () => Promise<void>;
  loading: boolean;
}

const Cohosted = ({ confirmFn, loading }: ConfirmProps) => (
  <div className="flex h-96 items-center justify-center rounded-md border border-primary bg-white drop-shadow-md md:w-1/2">
    <div className="space-y-16 text-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        Accept
        <span className="mx-3 rounded-lg bg-peach px-2 text-white md:rounded-xl">
          Co-host
        </span>
        Invite?
      </h1>
      <div className="flex items-center justify-center">
        <Button
          size="lg"
          onPress={confirmFn}
          className={cn("md:w-64", { "pointer-events-none": loading })}
          color="primary"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner size="sm" color="secondary" />
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="flex space-x-1.5 font-bold text-teal-400">
                <span className="font-extrabold md:hidden">Tap</span>
                <span className="hidden font-extrabold md:flex">Click</span>
                <span>here to confirm.</span>
              </span>
              <Iconx name="tap" />
            </div>
          )}
        </Button>
      </div>
    </div>
  </div>
);
