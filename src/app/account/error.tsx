"use client";
import { ErrorComp } from "@/app/_components/error";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorComp error={error} reset={reset} name="Account" />;
}
