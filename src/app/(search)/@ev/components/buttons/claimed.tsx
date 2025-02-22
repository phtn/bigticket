import { Button, cn } from "@nextui-org/react";
import { type GetTicketButtonProps } from "..";
import { Icon } from "@/icons";

export const ClaimedTicketButton = ({
  is_private = false,
  count = 0,
  h,
  fn,
}: GetTicketButtonProps) => {
  return (
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
          <h2 className="flex items-center gap-0.5 text-xl font-black">
            <span className="font-bold italic tracking-tighter text-teal-400">
              Ticket{count > 1 && "s"}
            </span>
            Claimed
            <Icon name="Check" className="text-teal-400" />
          </h2>
          <div className="flex items-center gap-1">
            <p className="font-inter text-sm font-semibold capitalize">
              view ticket{count > 1 && "s"}
            </p>
          </div>
        </div>
      </Button>
    </div>
  );
};
