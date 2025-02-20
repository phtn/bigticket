"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { use } from "react";
import { LiveViewCtx } from "../ctx";

export const ScanCode = () => {
  const { getQrcode } = use(LiveViewCtx)!;
  return (
    <Scanner
      onScan={getQrcode}
      components={{ finder: true }}
      formats={["qr_code"]}
      allowMultiple
      classNames={{
        video: "border border-secondary rounded-xl",
      }}
    />
  );
};
