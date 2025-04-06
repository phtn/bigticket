import "./styles.css";
import { useCallback, useEffect, useRef, useState } from "react";
import QRScanner from "qr-scanner";
import type QrScanner from "qr-scanner";
import { Err } from "@/utils/helpers";
import { Iconx } from "@/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface QrScannerProps {
  on: boolean;
  toggle: VoidFunction;
}

export const Scanner = ({ on, toggle }: QrScannerProps) => {
  const [qrOn, setQrOn] = useState<boolean>(on);

  const v = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const s = useRef<QrScanner | null>(null);

  const [scannedResult, setScannedResult] =
    useState<QrScanner.ScanResult | null>(null);
  const onScanSuccess = useCallback((result: QrScanner.ScanResult) => {
    console.log(result);
    setScannedResult(result);
  }, []);

  const onScanFail = useCallback((error: string | Error) => {
    console.log(error);
  }, []);

  const handlerStartQr = useCallback(() => {
    setQrOn(true);
  }, []);

  const handlerStopQr = useCallback(() => {
    setQrOn(false);

    toggle();
  }, [toggle]);

  useEffect(() => {
    let vref: HTMLVideoElement | null = null;
    if (v.current && !s.current) {
      vref = v.current;
      s.current = new QRScanner(v.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: b.current ?? undefined,
      });
      s.current.start().then(handlerStartQr).catch(Err);
    }

    return () => {
      if (!vref) {
        s.current?.stop();
      }
    };
  });

  useEffect(() => {
    if (qrOn) {
      s.current?.start().catch(Err);
    } else {
      s.current?.stop();
    }
  }, [qrOn]);

  return (
    <div className="qr-reader w-full">
      <video ref={v} className=""></video>
      <div ref={b} className="qr-box relative">
        <Iconx
          name="spinners-pulse-rings-multiple"
          className="absolute left-10 top-10 size-16 text-teal-200"
        />
        <Image
          src={"/svg/reader.svg"}
          alt="qr-frame"
          width={0}
          height={0}
          className="qr-frame aspect-square size-full scale-125 animate-pulse"
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={handlerStopQr}
          className={cn(
            "fixed bottom-10 z-50 flex size-16 items-center justify-center rounded-full border bg-chalk transition-all duration-300 active:scale-90 active:bg-gray-600 active:text-chalk",
          )}
        >
          <Iconx name="stop-bold" className="size-7 text-primary" />
        </button>
      </div>
      <div className="fixed bottom-0 flex h-10 w-full items-center bg-peach px-6">
        {scannedResult ? (
          <div>
            <p>{scannedResult.data}</p>
          </div>
        ) : (
          <p>No result yet</p>
        )}
      </div>
    </div>
  );
};
