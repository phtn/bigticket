"use client";

import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";
import { Button, Image, Spinner } from "@nextui-org/react";
import { memo, use, useCallback } from "react";
import { AccountContext, AccountCtx } from "./ctx";
import { PfpEditor } from "./side-pfp";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/icons";
import { CreateNewEvent } from "./create-event";

export const Profile = memo(() => <ProfileContent />);
Profile.displayName = "Profile";

export const Content = () => {
  const { vx, fileChange, inputFileRef, browseFile, photo_url } =
    use(AccountCtx)!;
  const pathname = usePathname();

  const AvatarOptions = useCallback(() => {
    const options = opts(
      <Spinner size="sm" color="primary" />,
      <Image
        alt="user-pfp"
        src={photo_url ?? undefined}
        radius="none"
        className="aspect-auto w-24 md:w-28 lg:w-32"
        isLoading={!vx}
      />,
    );
    return <>{options.get(!vx)}</>;
  }, [vx, photo_url]);

  return (
    <div className="relative w-full">
      <section className="relative h-fit w-full bg-white">
        <div
          id="cover-photo"
          className={cn("h-16 w-full md:h-20", "overflow-hidden")}
        ></div>
        <div className="flex h-12 w-full items-center justify-between bg-background pe-2 ps-32 md:h-16 md:pe-4 md:ps-36 lg:ps-40">
          <div className="whitespace-nowrap font-inter leading-none">
            <Link
              className="flex items-center"
              href={`${pathname}/preview?page=${vx?.account_id}`}
            >
              <h2 className="font-semibold tracking-tighter">{vx?.nickname}</h2>
            </Link>
            <h3 className="text-xs font-light tracking-tighter md:text-sm">
              {vx?.email}
            </h3>
          </div>

          <div className="md:px-1.5 md:pt-2.5">
            <CreateNewEvent />
          </div>
        </div>
        <div
          id="user-pfp"
          className="absolute bottom-0 mx-4 size-24 rounded-full bg-background p-1.5 md:mx-6 md:size-28 lg:size-32"
        >
          <div className="flex size-full items-center justify-center overflow-clip rounded-full bg-primary-200">
            <AvatarOptions />
          </div>

          <Icon
            name="Squircle"
            className="absolute bottom-2 right-0 z-[50] flex size-[28px] -rotate-[5deg] items-center text-void drop-shadow-sm md:right-3"
          />
          <input
            type="file"
            ref={inputFileRef}
            className="pointer-events-none size-1 opacity-0"
            onChange={fileChange}
          />
          <Button
            size="sm"
            isIconOnly
            variant="light"
            onPress={browseFile}
            className="group absolute -right-[2px] bottom-[6px] z-50 -rotate-[5deg] data-[hover=true]:bg-transparent md:right-[9.7px]"
          >
            <Icon
              name="Pen"
              className="size-4 stroke-0 text-chalk group-hover:text-secondary"
            />
          </Button>
        </div>
        <PfpEditor title="Profile Picture" />
      </section>
    </div>
  );
};
const ProfileContent = () => (
  <AccountContext>
    <Content />
  </AccountContext>
);
