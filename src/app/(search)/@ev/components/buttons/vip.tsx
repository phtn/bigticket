import { Icon } from "@/icons";
import { Shimmer } from "@/ui/text/sparkles";
import { Button, cn } from "@nextui-org/react";
import { PrivateNoAccess } from "./private";

interface VIPButtonProps {
  debounced: boolean;
  count: number | undefined;
  h: string;
  is_private: boolean | undefined;
  ticket_price?: number;
  fn: VoidFunction;
}
export const VIPButton = ({ count, h, is_private, fn }: VIPButtonProps) => (
  <div className="z-1 relative bg-primary" style={{ height: h }}>
    <Button
      onPress={fn}
      size="lg"
      disableRipple
      color="primary"
      className="h-full"
      radius="none"
      fullWidth
    >
      <div
        className={cn("flex w-full items-center justify-evenly", {
          "gap-12": is_private,
        })}
      >
        <PrivateNoAccess count={count ?? 0} />
        <VIPTicketLabel />
      </div>
    </Button>
  </div>
);
const VIPTicketLabel = () => {
  return (
    <h3 className="flex items-center justify-center gap-1 text-orange-100">
      <Icon name="Sparkle" className="size-3.5" />
      <Shimmer
        sparklesCount={6}
        className="font-inter text-[16px]"
        text="You are VIP"
      />
    </h3>
  );
};
