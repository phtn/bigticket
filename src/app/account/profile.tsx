"use client";

import { Iconx } from "@/icons";
import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";
import { Button, Image, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";
import { UserCtxProvider, useUserCtx } from "../ctx/user";
import { AccountContext, useAccountCtx } from "./ctx";
import { PfpEditor } from "./side-pfp";

export const Profile = memo(() => <ProfileContent />);
Profile.displayName = "Profile";

export const Content = () => {
  const { fileChange, inputFileRef, browseFile, updating, photoUrl } =
    useAccountCtx();

  const { xUser } = useUserCtx();
  const pathname = usePathname();

  const sub = pathname.split("/")[3];

  const AvatarOptions = useCallback(() => {
    const options = opts(
      <Spinner size="sm" color="primary" />,
      <Image
        alt="user-pfp"
        radius="none"
        src={photoUrl ?? undefined}
        className="aspect-auto w-24 md:w-28 lg:w-32"
        isLoading={!photoUrl}
      />,
    );
    return <>{options.get(!photoUrl)}</>;
  }, [photoUrl]);

  const AddPhotoOptions = useCallback(() => {
    const options = opts(
      <Spinner size="sm" className="text-white" />,
      <Iconx name="plus-sign" className="size-4 text-white" />,
    );
    return <>{options.get(updating)}</>;
  }, [updating]);

  return (
    <div className={cn("relative mb-8 w-full", { hidden: sub?.length === 1 })}>
      <section className="relative h-fit w-full bg-gray-200">
        <div
          id="cover-photo"
          className={cn("h-16 w-full md:h-20", "overflow-hidden")}
        ></div>
        <div className="flex h-12 w-full items-center justify-between bg-gray-200 pe-2 ps-32 md:h-16 md:pe-4 md:ps-36 lg:ps-40">
          <div className="whitespace-nowrap font-inter leading-none md:space-y-1">
            <Link
              className="flex items-center"
              href={`/account/profile/?p=${xUser?.account_id}`}
            >
              <h2 className="font-semibold tracking-tighter">
                {xUser?.nickname}
              </h2>
            </Link>
            <h3 className="text-xs font-light tracking-tighter md:text-sm">
              @{xUser?.username ?? xUser?.email?.split("@").shift()}
            </h3>
          </div>

          <div className="md:px-1.5 md:pt-2.5"></div>
        </div>
        <div
          id="user-pfp"
          className="group/edit absolute bottom-0 mx-4 size-24 rounded-full bg-gray-200 p-1.5 md:mx-6 md:size-28 lg:size-32"
        >
          <div className="flex size-full items-center justify-center overflow-clip rounded-full bg-gray-200">
            <AvatarOptions />
          </div>

          <Iconx
            name="squircle"
            className="absolute -right-2 bottom-2 z-[50] flex size-9 items-center text-secondary drop-shadow-sm transition-all duration-300 group-hover/edit:scale-110 md:right-1"
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
            className="group absolute -right-1.5 bottom-2.5 z-50 data-[hover=true]:bg-transparent md:bottom-2.5 md:right-1.5"
          >
            <AddPhotoOptions />
          </Button>
        </div>
        <PfpEditor title="Profile Picture" />
      </section>
    </div>
  );
};
const ProfileContent = () => (
  <AccountContext>
    <UserCtxProvider>
      <Content />
    </UserCtxProvider>
  </AccountContext>
);
