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
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
      // },
    },
    cornersDotOptions: {
      color: "#52525b",
    },
    backgroundOptions: {
      color: "transparent",
      round: 0,
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
