"use client";

import { Proxima } from "@/app/_components_/proxima";
import { Iconx } from "@/icons";
import { type PaymentStatus } from "@/lib/paymongo/schema/zod.payments";
import { cn } from "@/lib/utils";
import { cannonConfetti } from "@/ui/loader/confetti";
import { opts } from "@/utils/helpers";
import { Button, Spinner } from "@nextui-org/react";
import html2canvas from "html2canvas";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePayments } from "../usePayments";
import { Receipt } from "./receipt";

export const Content = ({
  status,
}: {
  status: PaymentStatus & "cancelled";
}) => {
  const { paymentDetails, isPaid, isProcessing } = usePayments();

  const updatedStatus = useMemo(() => {
    switch (status) {
      case "success":
        return isProcessing ? "Processing" : isPaid ? "Successful" : "Pending";
      case "fail":
        return isProcessing ? "Processing" : "Failed";
      case "cancelled":
        return isProcessing ? "Processing" : "Cancelled";
      default:
        return "Processing";
    }
  }, [status, isProcessing, isPaid]);

  useEffect(() => {
    if (!isProcessing && isPaid) {
      const timer = setTimeout(() => {
        cannonConfetti();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, isPaid]);

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

    const options = {
      useCORS: true,
      logging: true,
      background: "#fff",
      removeContainer: true,
      removeContainerId: "receipt-container",
      retina: true,
    };

    if (!receiptRef.current) return null;
    const canvas = await html2canvas(receiptRef.current, options);
    const dataUrl = canvas.toDataURL("image/png");
    setImageUrl(dataUrl);
    return dataUrl;
  }, [imageUrl]);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    const image = await generateImage();
    if (image) {
      const link = document.createElement("a");
      link.href = image;
      link.download = "big-ticket-receipt.png";
      link.click();
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
            alert("Failed to share receipt. isProcessing instead.");
          }
          console.log("Error sharing receipt:", error);
        }
      } else {
        // Fallback for browsers that don't support the Web Share API
        alert(
          "Web Share API not supported in your browser. isProcessing instead.",
        );
        await handleDownload();
      }
    }
  };

  const LoaderOptions = useCallback(() => {
    const awaitingConfirmation = isProcessing || !isPaid;
    const options = opts(
      <Spinner
        size="lg"
        color={!isPaid ? "warning" : "secondary"}
        className="scale-125"
      />,
      <Iconx
        name={isProcessing ? "spinner-ring" : "confirm-circle"}
        strokeWidth={0}
        className="size-[64px] text-secondary"
      />,
    );
    return (
      <div
        className={cn(
          "flex aspect-square items-center rounded-full bg-gray-100 p-6 transition-all duration-3000 ease-out",
          {
            "bg-green-50/60": !isProcessing && isPaid,
            "bg-yellow-50": isProcessing && !isPaid,
          },
        )}
      >
        {options.get(awaitingConfirmation)}
      </div>
    );
  }, [isProcessing, isPaid]);

  return (
    <div className="bg-white">
      <main className="mx-auto bg-white p-6">
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-6">
          <div className="mx-auto w-full max-w-md space-y-10 text-center">
            <div className="flex h-24 items-center justify-center">
              <LoaderOptions />
            </div>

            {/* Success Message */}
            <div className="-space-y-1">
              <div className="relative flex h-14 justify-center space-x-2 text-3xl font-bold tracking-tight transition-all duration-500 will-change-transform">
                <AnimatePresence>
                  {isProcessing && !isPaid && (
                    <motion.span
                      style={{ containIntrinsicSize: "auto" }}
                      className="absolute animate-pulse will-change-transform"
                      key={"processing"}
                      initial={{ x: -65 }}
                      exit={{
                        opacity: 0,
                        x: -250,
                        scale: 0.25,
                        transition: { duration: 0.4, ease: "easeIn" },
                      }}
                    >
                      Processing
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span
                  style={{ containIntrinsicSize: "auto" }}
                  className="absolute will-change-transform"
                  initial={{ x: 70 }}
                  animate={{
                    x: !isProcessing && isPaid ? -80 : 70,
                    transition: {
                      duration: 1.8,
                      damping: 12,
                      stiffness: 70,
                      type: "spring",
                      delay: 0.0,
                      ease: "easeOut",
                    },
                  }}
                >
                  Payment
                </motion.span>
                <AnimatePresence>
                  {!isProcessing && isPaid && (
                    <motion.span
                      style={{ containIntrinsicSize: "auto" }}
                      className="absolute will-change-transform"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{
                        opacity: 1,
                        x: 58,
                        transition: {
                          duration: 0.8,
                          damping: 15,
                          stiffness: 70,
                          type: "spring",
                          delay: 0.175,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      {updatedStatus}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex w-full items-center justify-center">
                <div
                  className={cn(
                    "rounded-full border-[0.33px] border-macd-gray/40",
                    { "border-teal-500/60": isPaid },
                  )}
                >
                  <div
                    className={cn(
                      "flex w-fit items-center rounded-full px-3 py-1",
                      "border-3 text-sm font-medium transition-all duration-300",
                      "border-gray-100 bg-white text-teal-700",
                      { "bg-teal-300/5": isPaid },
                    )}
                  >
                    {isProcessing || !isPaid ? (
                      <span className="animate-pulse text-macl-gray duration-500">
                        Receiving payment confirmation
                      </span>
                    ) : (
                      <span className="animate-enter">
                        We have received your payment!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div key="padding" />
          </div>

          <div
            ref={receiptRef}
            className="flex h-[460px] w-[340px] items-center px-4 md:w-screen"
          >
            {isProcessing && !isPaid ? null : (
              <Receipt
                data={paymentDetails}
                shareFn={handleShare}
                downloadFn={handleDownload}
                loading={isProcessing}
              />
            )}
          </div>
          <div key="big-padding" className="h-14" />
          <div className="h-12">
            {isProcessing && !isPaid ? null : (
              <Button
                size="md"
                color="warning"
                variant={"shadow"}
                onPress={showConfetti}
                className="delay-2000 mx-auto flex items-center gap-2 border-gray-300 bg-peach px-16 text-white"
              >
                <span className="font-bold">View Tickets</span>
              </Button>
            )}
          </div>
        </div>
      </main>
      <div className="h-28" />
      <div className="flex w-full items-end">
        <Proxima className="text-primary" />
      </div>
    </div>
  );
};
