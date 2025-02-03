"use client";

import { Button } from "@nextui-org/react";
import { useCallback } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  name: string;
}
export function ErrorComp({ error, reset, name }: ErrorProps) {
  const ResetButton = useCallback(
    () => (
      <Button
        onPress={reset}
        variant="shadow"
        color="primary"
        className="border-dyan/20 h-[36px] border-[0.33px] px-4"
      >
        Try again
      </Button>
    ),
    [reset],
  );

  return (
    <div className="m-4 space-y-4 rounded-lg border border-rose-400 p-4">
      <section className="flex items-center justify-between text-rose-500">
        <h1 className="flex space-x-4">
          <strong>ERROR !</strong>
          <span className="flex size-fit overflow-hidden rounded-md border border-gray-700">
            <span className="bg-gray-700 px-2 py-1 font-sans text-xs font-medium text-gray-200">
              Route
            </span>{" "}
            <span className="px-2 text-gray-800">{name}</span>
          </span>
        </h1>
        <ResetButton />
      </section>
      <div className="w-full border border-b" />
      <div className="flex space-x-2 font-mono text-xs text-gray-600">
        <span className="rounded-md bg-gray-200 px-2 py-1 font-sans font-medium">
          Name
        </span>
        <span>{error?.name}</span>
      </div>
      <div className="flex space-x-2 font-mono text-xs text-gray-600">
        <span className="rounded-md bg-gray-200 px-2 py-1 font-sans font-medium">
          Message
        </span>
        <span>{error?.message}</span>
      </div>
      <div className="flex space-x-2 font-mono text-xs text-gray-600">
        <span className="rounded-md bg-gray-200 px-2 py-1 font-sans font-medium">
          Digest
        </span>
        <span>{error?.digest}</span>
      </div>
      <div className="flex space-x-2 font-mono text-xs text-gray-600">
        <span className="rounded-md bg-gray-200 px-2 py-1 font-sans font-medium">
          Stack
        </span>
        <span>{error?.stack}</span>
      </div>
    </div>
  );
}
