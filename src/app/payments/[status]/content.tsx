"use client";

import { Iconx } from "@/icons";
import { type PaymentStatus } from "@/lib/paymongo/schema/zod.payments";
import { cn } from "@/lib/utils";
import { cannonConfetti } from "@/ui/loader/confetti";
import { Button, Spinner } from "@nextui-org/react";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePayments } from "../usePayments";
import { Receipt } from "./receipt";

export const Content = ({
  status,
}: {
  status: PaymentStatus & "cancelled";
}) => {
  const { paymentDetails, isPaid, loading } = usePayments();

  const updatedStatus = useMemo(() => {
    switch (status) {
      case "success":
        return loading ? "Processing" : isPaid ? "Successful" : "Pending";
      case "fail":
        return loading ? "Processing" : "Failed";
      case "cancelled":
        return loading ? "Processing" : "Cancelled";
      default:
        return "Processing";
    }
  }, [status, loading, isPaid]);

  useEffect(() => {
    if (!loading && isPaid) {
      const timer = setTimeout(() => {
        cannonConfetti();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [loading, isPaid]);

  const showConfetti = useCallback(() => {
    cannonConfetti();
  }, []);

  // const userTicketPayload = () => {
  //   const payload = {};
  // };

  const receiptRef = useRef<HTMLDivElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateImage = useCallback(async () => {
    if (imageUrl) {
      return imageUrl;
    }
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
      return dataUrl;
    }
    return null;
  }, [imageUrl]);

  const handleDownload = async () => {
    if (receiptRef.current) {
      const image = await generateImage();
      if (image) {
        const link = document.createElement("a");
        link.href = image;
        link.download = "big-ticket-receipt.png";
        link.click();
      }
    }
  };

  const handleShare = async () => {
    const image = await generateImage();
    if (image) {
      // Convert data URL to Blob
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], `big-ticket-receipt.png`, {
        type: "image/png",
      });

      // Check if Web Share API is supported
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Big Ticket Payment Receipt`,
            text: "Your payment receipt",
            files: [file],
          });
          console.log("Receipt shared successfully");
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            console.log("User cancelled sharing");
            // Do nothing, user just cancelled
          } else {
            console.log("Error sharing receipt:", error);
            alert("Failed to share receipt. Downloading instead.");
          }
          console.log("Error sharing receipt:", error);
        }
      } else {
        // Fallback for browsers that don't support the Web Share API
        alert(
          "Web Share API not supported in your browser. Downloading instead.",
        );
        await handleDownload();
      }
    }
  };

  return (
    <main className="mx-auto h-[calc(100vh-64px)] bg-white p-6">
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-6">
        <div className="mx-auto w-full max-w-md space-y-10 text-center">
          <div className="flex h-24 items-center justify-center">
            <div
              className={cn(
                "flex aspect-square items-center rounded-full bg-gray-100 p-2 transition-all duration-3000 ease-out",
                {
                  "bg-green-50 p-6": !loading && isPaid,
                  "bg-yellow-50 p-4": loading && !isPaid,
                },
              )}
            >
              {loading || !isPaid ? (
                <Spinner
                  size="lg"
                  color={!isPaid ? "warning" : "secondary"}
                  className="scale-125"
                />
              ) : (
                <Iconx
                  name={loading ? "spinner-ring" : "confirm-circle"}
                  strokeWidth={0}
                  className="size-[64px] text-secondary"
                />
              )}
              {/* <Iconx
                name={loading ? "spinners-3-dots-move" : "confirm-circle"}
                className="size-16 text-secondary"
              /> */}
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Payment <span className="pl-1">{updatedStatus}</span>
            </h1>
            <p className="mx-auto max-w-sm text-center opacity-60">
              {loading || !isPaid ? (
                "Receivig payment confirmation"
              ) : (
                <span className="animate-enter delay-1000">
                  Payment successfully completed!
                </span>
              )}
            </p>
          </div>

          {loading && !isPaid ? null : (
            <Button
              size="lg"
              color="warning"
              variant={"shadow"}
              onPress={showConfetti}
              className="delay-2000 mx-auto flex animate-enter items-center gap-2 border-gray-300 bg-peach px-16 text-white"
            >
              View Tickets
            </Button>
          )}

          {/* Padding */}
          <div />
        </div>

        <div
          ref={receiptRef}
          className="flex h-[460px] w-[340px] items-center md:w-screen"
        >
          {loading && !isPaid ? null : (
            <Receipt
              data={paymentDetails}
              shareFn={handleShare}
              downloadFn={handleDownload}
              loading={loading}
            />
          )}
        </div>
      </div>
    </main>
  );
};
