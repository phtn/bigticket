"use client";

import { VxCtx } from "@/app/ctx/convex/vx";
import { CursorCtx } from "@/app/ctx/cursor";
import { useToggle } from "@/hooks/useToggle";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { TextLoader } from "@/ui/loader/text";
import { opts } from "@/utils/helpers";
import {
  Avatar,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useCallback } from "react";

export const UserNav = () => {
  const pathname = usePathname();
  const { photo_url, vx } = use(VxCtx)!;
  const UserOptions = useCallback(() => {
    const options = opts(
      <UserProfile photo_url={photo_url ?? undefined} />,
      <Button
        variant="solid"
        radius="full"
        className="w-fit bg-white font-inter text-[16px] font-medium tracking-tighter"
      >
        <TextLoader color="text-primary-500" />
      </Button>,
    );
    return <>{options.get(!!vx)}</>;
  }, [photo_url, vx]);
  return (
    <div className="flex w-full items-center justify-between bg-white p-3 font-inter">
      <div
        className={cn("z-1 relative flex h-full w-[420px] items-center", {})}
      >
        {pathname.split("/")[1] === "account" ? null : <Searchbar />}
      </div>
      <div className="flex items-center px-1 text-void">
        <UserOptions />
      </div>
    </div>
  );
};
const Searchbar = () => {
  const { handleInputHover } = use(CursorCtx)!;
  return (
    <div className={cn("relative flex w-full items-center", {})}>
      <Input
        size="lg"
        radius="full"
        variant="flat"
        placeholder="Search events"
        className="rounded-full bg-ghost"
        onMouseEnter={handleInputHover(true)}
        onMouseLeave={handleInputHover(false)}
        classNames={{
          input:
            "placeholder:text-primary/60 text-void dark:text-void font-inter placeholder:text-sm tracking-tight placeholder:tracking-tight placeholder:font-light placeholder:ps-0.5 ps-2 font-inter w-full",
          inputWrapper: "shadow-none w-full",
          innerWrapper: "border-0",
        }}
        startContent={
          <Icon
            name="Search"
            className="pointer-events-none size-4 stroke-gray-500 stroke-1 text-gray-500"
          />
        }
      />
    </div>
  );
};

const UserProfile = (props: { photo_url: string | undefined }) => {
  const { toggle } = useToggle();
  return (
    <Popover
      isDismissable
      shouldCloseOnBlur
      shouldCloseOnScroll
      placement="bottom-end"
      onOpenChange={toggle}
    >
      <PopoverTrigger>
        <Avatar alt="user-pfp" src={props?.photo_url} />
      </PopoverTrigger>
      <PopoverContent
        onClick={toggle}
        className="border-[0.33px] border-primary-500 bg-coal"
      >
        <UserContextMenu />
      </PopoverContent>
    </Popover>
  );
};

const UserContextMenu = () => (
  <div className="w-full bg-coal py-2 font-inter">
    <HyperList data={menu_items} component={MenuListItem} keyId="id" />
  </div>
);

const MenuListItem = (menu: MenuItem) => (
  <Link
    href={menu.href}
    className="flex w-full items-center justify-between space-x-5 rounded-lg px-4 py-2 hover:bg-primary-500/30"
  >
    <div className="flex items-center">
      <h2 className="text-xs font-medium tracking-tighter text-primary-200">
        {menu.label}
      </h2>
    </div>
    {/* <Icon name="RightLine" className="size-5 stroke-0 text-macl-gray" /> */}
  </Link>
);

interface MenuItem {
  id: number;
  label: string;
  href: string;
}
const menu_items: MenuItem[] = [
  {
    id: 1,
    label: "Account",
    href: "/account",
  },
  {
    id: 2,
    label: "Sign out",
    href: "/signout",
  },
];
