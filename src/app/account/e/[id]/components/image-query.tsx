import { SidebarCtx } from "@/app/ctx/sidebar";
import type { ClassName } from "@/app/types";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { type FC, use } from "react";

interface SidebarProps {
  className?: ClassName;
}
export const ImageQuery = ({ className }: SidebarProps) => {
  const { toggle, open } = use(SidebarCtx)!;
  return (
    <aside className={cn("absolute z-50 -mt-4")}>
      <div
        className={cn(
          "fixed flex w-[360px] -translate-x-[360px] items-start px-8 py-4 transition-transform duration-300 portrait:px-4",
          className,
          { "translate-x-0": open },
        )}
      >
        <HideButton fn={toggle} />
        <section className="relative w-full space-y-6 rounded-xl border-[0.33px] border-primary-100 bg-chalk/80 p-2 font-inter shadow-lg backdrop-blur-2xl md:h-[calc(80vh)]">
          <div className="tracking-tight">Select an image category</div>
          <ListTitle title="Categories" />
        </section>
      </div>
    </aside>
  );
};

const HideButton = (props: { fn: VoidFunction }) => (
  <Button
    size="sm"
    isIconOnly
    variant="ghost"
    color="default"
    onPress={props.fn}
    className="group absolute right-6 top-6 z-[60] border-0 data-[hover=true]:opacity-100"
  >
    <Icon name="LeftChev" className="size-5 stroke-0 text-slate-500" />
  </Button>
);

const ListTitle: FC<{ title: string }> = ({ title }) => (
  <div className="flex h-10 w-full items-center justify-between space-x-3 px-2">
    <p className="whitespace-nowrap text-xs font-semibold uppercase text-slate-700 drop-shadow-sm">
      {title}
    </p>
  </div>
);
