"use client";

import { CursorCtx } from "@/app/ctx/cursor";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { UserCtx } from "@/app/ctx/user/ctx";
import { useScreen } from "@/hooks/useScreen";
import { useToggle } from "@/hooks/useToggle";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import { Hyper } from "@/ui/button/button";
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
import chalk from "chalk";
import { useRouter } from "next/navigation";
import {
  type JSX,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface NavItem {
  id: string;
  label: string;
  content: JSX.Element | null;
}

export const UserNav = () => {
  const { photoUrl } = use(UserCtx)!;

  const navs: NavItem[] = useMemo(
    () => [
      {
        id: "collection",
        label: "collection",
        content: <Collection />,
      },
      {
        id: "user",
        label: "user",
        content: <UserAvatar photo_url={photoUrl} />,
      },
    ],
    [photoUrl],
  );

  const NavOptions = useCallback(() => {
    const options = opts(<UserSign />, <NavList data={navs} />);
    return <>{options.get(!photoUrl)}</>;
  }, [photoUrl, navs]);

  return <NavOptions />;
};

const UserSign = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignin = () => {
    const big = chalk.hex("#59D2CB").bold.bgBlack;
    const ticket = chalk.hex("#fb923c").bold.bgBlack;
    const cutout = chalk.gray.bgBlack.bold("●");
    console.clear();
    console.log(cutout + big(" BIG ") + ticket("ticket ") + cutout);
  };

  return (
    <div className="absolute right-0 flex h-16 w-fit items-center px-4">
      {ready ? (
        <Hyper
          onClick={handleSignin}
          compact
          label="Sign in"
          className="small-ticket bg-ticket/40 text-chalk hover:bg-teal-500 hover:text-white"
          dim
        />
      ) : (
        <TextLoader color="text-ticket" />
      )}
    </div>
  );
};

const NavList = ({ data }: { data: NavItem[] }) => {
  return (
    <HyperList
      data={data}
      component={NavListItem}
      container="absolute right-0 flex h-16 w-2/3 items-center justify-end space-x-4 font-inter"
      itemStyle="pointer-events-auto"
      keyId="id"
    />
  );
};

const NavListItem = (nav: NavItem) => <div>{nav.content}</div>;

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
// const Dap = () => {
//   const clickFn = useCallback(async () => {
//     const response = await fetchId();
//     console.log(response);
//   }, []);
//   return (
//     <ButtonIcon
//       onClick={clickFn}
//       icon="CarDashboard"
//       bg="text-white"
//       color="text-macl-gray"
//     />
//   );
// };
interface MenuItem {
  id: number;
  label: string;
  href: string;
  icon: IconName;
}
const UserAvatar = (props: { photo_url: string | null }) => {
  const { open, toggle } = useToggle();
  const avatar = props.photo_url ?? undefined;
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
    const menu: MenuItem[] = [
      {
        id: 1,
        label: "Profile",
        href: "/account",
        icon: "UserSettings",
      },
      {
        id: 2,
        label: "Tickets",
        href: "/account/tickets",
        icon: "Ticket",
      },
      {
        id: 3,
        label: "Events",
        href: "/account/events",
        icon: "ChartIcon",
      },
    ];

    const MenuListItem = ({ href, label, icon }: MenuItem) => {
      return (
        <button
          onClick={handleRoute(href, toggle)}
          className="group flex w-full items-center justify-between gap-12 rounded-lg px-3 py-3"
        >
          <div className="flex items-center">
            <h2 className="font-inter font-semibold tracking-tighter drop-shadow-sm">
              {label}
            </h2>
          </div>
          <Icon
            name={icon}
            className="size-5 text-chalk transition-all duration-300 group-hover:scale-110 group-hover:text-white"
          />
        </button>
      );
    };

    return (
      <HyperList
        keyId="id"
        delay={0.15}
        data={menu}
        component={MenuListItem}
        container="w-full space-y-2 py-2"
        itemStyle="first:bg-primary hover:opacity-90 bg-peach last:bg-secondary transition-colors border-[0.33px] border-google text-white duration-300 rounded-lg"
      />
    );
  }, [handleRoute, toggle]);

  return (
    <div className="flex w-fit items-center px-4 md:gap-8">
      <Popover isOpen={open} placement="bottom-end" onOpenChange={toggle}>
        <PopoverTrigger className="cursor-pointer border border-macl-gray">
          <Avatar alt="user-pfp" src={avatar} size={isDesktop ? "md" : "sm"} />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] border-[0.33px] border-macl-gray bg-google">
          <UserMenu />
        </PopoverContent>
      </Popover>
    </div>
  );
};
