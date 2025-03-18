import { Button, cn } from "@nextui-org/react";
import { type GetTicketProps } from "./d";
import { Iconx } from "@/icons";

export const ViewTicket = ({ ticketCount = 0, fn }: GetTicketProps) => {
  return (
    <div className="z-1 relative h-full bg-primary">
      <Button
        onPress={fn}
        size="lg"
        disableRipple
        color="primary"
        className="h-full"
        radius="none"
        fullWidth
      >
        <div className={cn("flex w-full items-center justify-evenly", {})}>
          <h2 className="flex items-center gap-0.5 text-xl font-black">
            <span className="font-bold italic tracking-tighter text-teal-400">
              Ticket{ticketCount > 1 && "s"}
            </span>
            Claimed
            <Iconx name="check" className="text-teal-400" />
          </h2>
          <div className="flex items-center gap-1">
            <p className="font-inter text-sm font-semibold capitalize">
              view ticket{ticketCount > 1 && "s"}
            </p>
          </div>
        </div>
      </Button>
    </div>
  );
};
