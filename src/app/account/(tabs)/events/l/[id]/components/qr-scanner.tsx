import { useSoundFX } from "@/hooks/use-sfx";
import { Iconx } from "@/icons";
import { cn } from "@/lib/utils";
import { Particles } from "@/ui/loader/particles";
import { Err } from "@/utils/helpers";
import type QrScanner from "qr-scanner";
import QRScanner from "qr-scanner";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./styles.css";

interface QrScannerProps {
  on: boolean;
  closeFn: VoidFunction;
  ref: RefObject<QrScanner | null>;
}

export const Scanner = ({ on, closeFn, ref }: QrScannerProps) => {
  const v = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLDivElement>(null);
  // const s = useRef<QrScanner | null>(null);
  const { startSFX } = useSoundFX();

  const [scannedResult, setScannedResult] =
    useState<QrScanner.ScanResult | null>(null);

  const onScanSuccess = useCallback((result: QrScanner.ScanResult) => {
    setScannedResult(result);
    console.log(result);
  }, []);

  const onScanFail = useCallback((error: string | Error) => {
    console.log("QR Scan failed:", error);
  }, []);

  // Initialize QR Scanner
  useEffect(() => {
    if (!v.current || ref.current) return;

    ref.current = new QRScanner(v.current, onScanSuccess, {
      onDecodeError: onScanFail,
      preferredCamera: "environment",
      highlightScanRegion: true,
      highlightCodeOutline: true,
      overlay: b.current ?? undefined,
    });

    return () => {
      ref.current?.destroy();
      ref.current = null;
    };
  }, [onScanSuccess, onScanFail, ref]);

  // Handle scanner state
  useEffect(() => {
    if (on) {
      ref.current
        ?.start()
        .then(() => startSFX())
        .catch(Err);
    } else {
      ref.current?.stop();
    }
  }, [on, startSFX, ref]);

  return (
    <div className="qr-reader max-w-sm">
      <video ref={v} className=""></video>
      <div ref={b} className="qr-box relative">
        <div className="qr-frame flex h-full items-center px-6">
          <div className="qr-frame-corner flex h-80 w-full items-center justify-center rounded-3xl border-4 border-teal-400/60">
            <div className="h-16 w-full border-b border-teal-100/60 bg-gradient-to-t from-teal-200/20 via-teal-300/10 to-transparent">
              <Particles
                vy={-0.5}
                className="relative inset-0 z-[80] h-16 select-none opacity-60"
                quantity={69}
                color="#fff"
                ease={20}
                refresh
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-[100] hidden items-center justify-center">
        <div className="fixed bottom-10 z-[100] flex items-center justify-center rounded-full border-2 border-coal/30 bg-coal/30 p-1.5">
          <button
            onClick={closeFn}
            className={cn(
              "relative z-[100] flex size-16 items-center justify-center rounded-full border-2 border-teal-400 bg-void transition-all duration-300 active:scale-90 active:bg-gray-600 active:text-chalk",
            )}
          >
            <Iconx name="stop-bold" className="size-7 text-teal-300" />
          </button>
        </div>
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
