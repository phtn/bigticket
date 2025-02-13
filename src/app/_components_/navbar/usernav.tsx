"use client";

import { VxCtx } from "@/app/ctx/convex/vx";
import { CursorCtx } from "@/app/ctx/cursor";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { useScreen } from "@/hooks/useScreen";
import { useToggle } from "@/hooks/useToggle";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import { HyperList } from "@/ui/list";
import { TextLoader } from "@/ui/loader/text";
import { opts } from "@/utils/helpers";
import {
  Avatar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { type JSX, use, useCallback, useMemo } from "react";

export const UserNav = () => {
  const { photo_url } = use(VxCtx)!;

  const menus: IMenu[] = useMemo(
    () => [
      {
        id: "collection",
        label: "collection",
        content: <Collection />,
      },
      {
        id: "user",
        label: "user",
        content: <UserAvatar photo_url={photo_url ?? undefined} />,
      },
    ],
    [photo_url],
  );

  const NavOptions = useCallback(() => {
    const options = opts(<Menus data={menus} />, <UserLoader />);
    return <>{options.get(!!photo_url)}</>;
  }, [photo_url, menus]);

  return <NavOptions />;
};

const UserLoader = () => (
  <div className="absolute right-0 flex h-16 w-fit items-center px-4">
    <TextLoader color="text-primary-500" />
  </div>
);

const Menus = ({ data }: { data: IMenu[] }) => {
  return (
    <HyperList
      data={data}
      component={MenuItem}
      container="absolute right-0 flex h-16 w-2/3 items-center justify-end space-x-4 font-inter"
      itemStyle="pointer-events-auto"
      keyId="id"
    />
  );
};

interface IMenu {
  id: string;
  label: string;
  content: JSX.Element | null;
}
const MenuItem = (menu: IMenu) => <div>{menu.content}</div>;

export const Searchbar = () => {
  const { handleInputHover } = use(CursorCtx)!;
  return (
    <div className={cn("relative flex w-44 items-center md:w-full")}>
      <Input
        size="md"
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

const Collection = () => {
  const { toggle } = use(SidebarCtx)!;
  return (
    <ButtonIcon
      onClick={toggle}
      icon="Bookmark2"
      bg="text-white"
      color="text-macl-gray"
    />
  );
};

const UserAvatar = (props: { photo_url: string | undefined }) => {
  const { open, toggle } = useToggle();
  const { isDesktop } = useScreen();
  const router = useRouter();
  const handleRoute = useCallback(
    (href: string, toggle: VoidFunction) => () => {
      toggle();
      router.push(href);
    },
    [router],
  );

  const UserMenu = useCallback(() => {
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

    const MenuListItem = ({ href, label }: MenuItem) => {
      return (
        <button
          onClick={handleRoute(href, toggle)}
          className="flex w-full items-center justify-between space-x-5 rounded-lg px-4 py-2 hover:bg-primary-500/30"
        >
          <div className="flex items-center">
            <h2 className="text-xs font-medium tracking-tighter text-primary-200">
              {label}
            </h2>
          </div>
        </button>
      );
    };

    return (
      <div className="w-full bg-coal py-2 font-inter">
        <HyperList data={menu_items} component={MenuListItem} keyId="id" />
      </div>
    );
  }, [handleRoute, toggle]);

  return (
    <div className="flex w-fit items-center px-4 md:gap-8">
      <Popover isOpen={open} placement="bottom-end" onOpenChange={toggle}>
        <PopoverTrigger className="cursor-pointer border border-primary-800">
          <Avatar
            alt="user-pfp"
            src={props?.photo_url}
            size={isDesktop ? "md" : "sm"}
          />
        </PopoverTrigger>
        <PopoverContent className="border border-primary-600 bg-coal">
          <UserMenu />
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface MenuItem {
  id: number;
  label: string;
  href: string;
}
