"use client";

import { useEffect, useRef, useMemo } from "react";
import type {
  Options,
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
} from "qr-code-styling";
import QRCodeStyling from "qr-code-styling";

interface QrCodeProps {
  url: string | undefined;
  logo: string;
  width?: number;
  height?: number;
}

export const QrCodeGen = ({
  url,
  logo,
  width = 100,
  height = 100,
}: QrCodeProps) => {
  const options = useMemo<Options>(
    () => ({
      width,
      height,
      type: "svg" as DrawType,
      data: url,
      image: logo,
      margin: 0.75,
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: "Byte" as Mode,
        errorCorrectionLevel: "L" as ErrorCorrectionLevel,
      },
      imageOptions: {
        hideBackgroundDots: false,
        imageSize: 1,
        margin: 0.75,
        crossOrigin: "Anonymous",
      },
      dotsOptions: {
        color: "#09090b",
        gradient: {
          type: "radial", // 'linear'
          rotation: 0,
          colorStops: [
            { offset: 0.25, color: "#52525b" },
            { offset: 1, color: "#27272a" },
          ],
        },
        type: "classy-rounded" as DotType,
      },
      cornersSquareOptions: {
        color: "#52525b",
        type: "square" as CornerSquareType,
      },
      cornersDotOptions: {
        color: "#52525b",
      },
      backgroundOptions: {
        color: "transparent",
        round: 0,
      },
    }),
    [url, logo, width, height]
  );

  const qrCode = useMemo(() => new QRCodeStyling(options), [options]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode]);

  useEffect(() => {
    qrCode.update(options);
  }, [qrCode, options]);

  return <div className="size-full" ref={ref} />;
};
