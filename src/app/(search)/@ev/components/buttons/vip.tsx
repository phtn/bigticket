import { Icon } from "@/icons";
import { Shimmer } from "@/ui/text/sparkles";
import { Button, cn, Spinner } from "@nextui-org/react";

export const VIPTicketLabel = () => {
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
interface VIPButtonProps {
  debounced: boolean;
  count: number;
}
export const VIPButton = ({ debounced, count }: VIPButtonProps) => (
  <>
    {debounced ? (
      <Button className={cn("flex w-full items-center justify-between", {})}>
        <VIPTicketLabel />
        {count}
        <div className="flex gap-2"></div>
      </Button>
    ) : (
      <div className="flex w-screen items-center justify-center md:w-[30rem]">
        <Spinner size="sm" color="secondary" />
      </div>
    )}
  </>
);
