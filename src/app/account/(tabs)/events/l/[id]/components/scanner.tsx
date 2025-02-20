import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

interface ScanCodeProps {
  getFn: (data: IDetectedBarcode[]) => void;
}

export const ScanCode = ({ getFn }: ScanCodeProps) => {
  return (
    <Scanner
      onScan={async (data) => {
        if (data) {
          getFn(data);
        }
      }}
    />
  );
};
