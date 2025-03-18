import { useToggle } from "@/hooks/useToggle";
import { Iconx } from "@/icons";
import { type IconName } from "@/icons/types";
import { HyperList } from "@/ui/list";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback } from "react";

export interface IMenuItem {
  id: number;
  type: "route" | "action";
  label: string;
  value: string;
  icon: IconName;
}

interface PopOptionsProps {
  menu: IMenuItem[];
  children: ReactNode;
  onAction?: (action: string) => Promise<void>;
}

export const PopOptions = ({ menu, children, onAction }: PopOptionsProps) => {
  const { open, toggle } = useToggle();
  const router = useRouter();

  const handleMenuItem = useCallback(
    async (item: IMenuItem) => {
      toggle();
      if (item.type === "route") {
        router.push(item.value);
      } else if (item.type === "action" && onAction) {
        await onAction(item.value);
      }
    },
    [router, toggle, onAction],
  );

  const MenuListItem = useCallback(
    (item: IMenuItem) => (
      <button
        key={item.id}
        onClick={() => handleMenuItem(item)}
        className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm hover:bg-default-100"
      >
        <Iconx name={item.icon} className="size-4" />
        <span>{item.label}</span>
      </button>
    ),
    [handleMenuItem],
  );

  const MenuList = useCallback(
    () => (
      <HyperList
        keyId="id"
        delay={0.15}
        data={menu}
        component={MenuListItem}
        container="w-full space-y-2 p-2"
        itemStyle="first:bg-primary hover:opacity-80 last:bg-teal-500 transition-colors border-[0.33px] border-google text-white duration-300 rounded-lg"
      />
    ),
    [menu, MenuListItem],
  );

  return (
    <Popover
      placement="bottom-end"
      showArrow
      offset={10}
      isOpen={open}
      onOpenChange={toggle}
      classNames={{
        arrow: "bg-gray-400",
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-48 bg-gray-300 p-0">
        <MenuList />
      </PopoverContent>
    </Popover>
  );
};
