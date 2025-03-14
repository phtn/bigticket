import { HyperList } from "@/ui/list";
import { Button, cn } from "@nextui-org/react";
import { type FC } from "react";
import type {
  CategoryItem,
  IconWrapperProps,
  ItemCounterProps,
  SidebarListProps,
} from "./types";
import { Iconx } from "@/icons/icon";

export const ListTitle: FC<{ title: string }> = ({ title }) => (
  <div className="flex h-10 w-full items-center justify-between space-x-3 px-2">
    <p className="whitespace-nowrap text-xs font-semibold uppercase text-slate-700 drop-shadow-sm">
      {title}
    </p>
  </div>
);

export const HideButton = (props: { fn: VoidFunction }) => (
  <Button
    size="sm"
    isIconOnly
    variant="ghost"
    onPress={props.fn}
    className="group absolute right-6 top-6 z-[60] border-0"
  >
    <Iconx name="arrow-left-01" className="size-5 stroke-0 text-gray-600" />
  </Button>
);

export const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div
    className={cn(
      "flex size-6 flex-shrink-0 items-center justify-center rounded-full",
      className,
    )}
  >
    {children}
  </div>
);

export const SidebarList = <T extends CategoryItem>({
  title,
  data,
  component: Component,
}: SidebarListProps<T>) => {
  return (
    <div>
      <ListTitle title={title} />
      <div className="w-full overflow-hidden rounded-xl bg-white/80">
        <HyperList keyId="id" data={data} component={Component} />
      </div>
    </div>
  );
};

export const SidebarListItem = (item: CategoryItem) => (
  <div className="spacex-5 flex w-full items-center justify-between p-3 hover:bg-white">
    <div className="flex items-center space-x-2">
      <IconWrapper className={cn("mx-2")}>
        <Iconx name={item.icon} className="size-6 shrink-0" />
      </IconWrapper>
      <h2 className="text-sm capitalize tracking-tight text-primary/80">
        {item.label}
      </h2>
    </div>
    <ItemCounter count={item.count} color={item.color} />
  </div>
);

export const ItemCounter = ({ count }: ItemCounterProps) => (
  <div className="relative flex size-8 items-center justify-center">
    <Iconx
      name="squircle"
      className="absolute size-8 text-macl-gray opacity-10"
    />
    <p className="absolute font-sans text-xs font-medium text-gray-600">
      {count}
    </p>
  </div>
);
