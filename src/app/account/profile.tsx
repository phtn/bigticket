"use client";

import { cn } from "@/lib/utils";
import { Err, opts } from "@/utils/helpers";
import { Button, Image, Spinner } from "@nextui-org/react";
import { memo, use, useCallback, useEffect, useState } from "react";
import { AccountContext, AccountCtx } from "./ctx";
import { PfpEditor } from "./side-pfp";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/icons";
import { ConvexCtx } from "../ctx/convex";
import { SelectUser } from "convex/users/d";
import { useSession } from "../ctx/auth/useSession";
import { api } from "@vx/api";
import { useQuery } from "convex/react";

export const Profile = memo(() => <ProfileContent />);
Profile.displayName = "Profile";

export const Content = () => {
  const { vx, fileChange, inputFileRef, browseFile, photo_url } =
    use(AccountCtx)!;

  const { files } = use(ConvexCtx)!;
  const [vxuser, setVx] = useState<SelectUser | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const { user } = useSession()?.userSessionData;

  const userById = useQuery(api.users.get.byId, { id: user?.id ?? "" });
  useEffect(() => {
    setPending(true);
    if (userById) {
      setVx(userById);
    }
  }, [userById]);

  const getPhoto = useCallback(async () => {
    if (!vxuser?.photo_url) return null;
    const url = vxuser?.photo_url;
    if (url.startsWith("https")) {
      setPending(false);
      return url;
    }
    setPending(false);
    return await files.get(url);
  }, [files, vxuser?.photo_url]);

  useEffect(() => {
    getPhoto().then(setPhotoUrl).catch(Err(setPending));
  }, [getPhoto]);

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
  }, [photo_url]);

  return (
    <div className={cn("relative mb-8 w-full", { hidden: sub?.length === 1 })}>
      <section className="relative h-fit w-full bg-gray-200">
        <div
          id="cover-photo"
          className={cn("h-16 w-full md:h-20", "overflow-hidden")}
        ></div>
        <div className="flex h-12 w-full items-center justify-between bg-gray-200 pe-2 ps-32 md:h-16 md:pe-4 md:ps-36 lg:ps-40">
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

          <div className="md:px-1.5 md:pt-2.5"></div>
        </div>
        <div
          id="user-pfp"
          className="group/edit absolute bottom-0 mx-4 size-24 rounded-full bg-gray-200 p-1.5 md:mx-6 md:size-28 lg:size-32"
        >
          <div className="flex size-full items-center justify-center overflow-clip rounded-full bg-gray-200">
            <AvatarOptions />
          </div>

          <Icon
            name="Squircle"
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
            <Icon
              name="Plus"
              className="size-3.5 text-chalk group-hover:text-white"
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
