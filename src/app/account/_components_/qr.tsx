"use client";

import { useEffect, useRef, useState } from "react";
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
  const [options] = useState<Options>({
    width,
    height,
    type: "svg" as DrawType,
    data: url,
    image: logo,
    margin: 0.5,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte" as Mode,
      errorCorrectionLevel: "M" as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.5,
      margin: 0.5,
      crossOrigin: "same-origin",
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
      type: "dots" as DotType,
    },
    cornersSquareOptions: {
      color: "#14141b",
      type: "extra-rounded" as CornerSquareType,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
      // },
    },
    cornersDotOptions: {
      color: "#14141b",
      // type: "none" as CornerDotType,
      gradient: {
        type: "radial",
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#475569" },
          { offset: 1, color: "#64748b" },
        ],
      },
    },
    backgroundOptions: {
      color: "transparent",
      round: 0.15,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 0,
      //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
      // },
    },
  });
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  return <div className="size-full" ref={ref} />;
};
