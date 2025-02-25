import { Icon } from "@/icons";
import { Shimmer } from "@/ui/text/sparkles";
import { Button, cn } from "@nextui-org/react";
import { PrivateNoAccess, PrivateWithAccess } from "./private";
import type { ReactNode } from "react";
import chalk from "chalk";

interface VIPAccesProps {
  ticketCount?: number;
  ticketPrice?: number;
  fn: VoidFunction;
}
interface VIPComponentProps {
  children: ReactNode;
  fn: VoidFunction;
}
const VIPComponent = ({ fn, children }: VIPComponentProps) => {
  return (
    <div className="z-1 relative h-full bg-primary">
      <Button
        size="lg"
        radius="none"
        onPress={fn}
        color="primary"
        className="h-full"
        fullWidth
        disableRipple
      >
        {children}
      </Button>
    </div>
  );
};
const VIPLabel = () => {
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
export const VIPAccess = ({ ticketCount, fn }: VIPAccesProps) => (
  <VIPComponent fn={fn}>
    <div
      className={cn(
        "flex w-full items-center justify-between px-4 md:justify-evenly md:px-0",
        {},
      )}
    >
      <PrivateWithAccess count={ticketCount ?? 0} />
      <VIPLabel />
    </div>
  </VIPComponent>
);

const PrivateLabel = () => {
  return (
    <h3 className="flex items-center justify-center gap-1 text-orange-100">
      <Icon name="Sparkle" className="size-3.5" />
      <Shimmer
        sparklesCount={6}
        className="font-inter text-[16px]"
        text="Members Only"
      />
    </h3>
  );
};

const handleSignin = () => {
  const big = chalk.hex("#59D2CB").bold.bgBlack;
  const ticket = chalk.hex("#fb923c").bold.bgBlack;
  const cutout = chalk.gray.bgBlack.bold("●");
  console.clear();
  console.log(cutout + big(" BIG ") + ticket("ticket ") + cutout);
};
export const VIPNoAccess = () => (
  <VIPComponent fn={handleSignin}>
    <div
      className={cn(
        "flex w-full items-center justify-between px-1 md:justify-evenly md:px-0",
        {},
      )}
    >
      <PrivateNoAccess />
      <PrivateLabel />
    </div>
  </VIPComponent>
);
