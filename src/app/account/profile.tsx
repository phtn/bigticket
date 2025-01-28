import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";
import { Button, Image, Spinner } from "@nextui-org/react";
import { use, useCallback } from "react";
import { AccountCtx } from "./ctx";
import { PfpEditor } from "./side-pfp";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/icons";
import { CreateNewEvent } from "./create-event";

export const Profile = () => {
  const { vx, fileChange, inputFileRef, browseFile } = use(AccountCtx)!;
  const pathname = usePathname();

  const AvatarOptions = useCallback(() => {
    const options = opts(
      <Spinner size="sm" color="primary" />,
      <Image
        alt="user-pfp"
        src={vx?.photo_url}
        width={124}
        height={124}
        isLoading={!vx}
      />,
    );
    return <>{options.get(!vx)}</>;
  }, [vx]);

  return (
    <section id="top-section" className="relative h-fit w-full bg-white">
      <div
        id="cover-photo"
        className={cn("h-20 w-full", "overflow-hidden")}
      ></div>
      <div className="flex h-16 w-full items-center justify-between bg-background pe-4 ps-44">
        <div className="items-center whitespace-nowrap font-inter">
          <Link
            className="flex items-center"
            href={`${pathname}/preview?page=${vx?.account_id}`}
          >
            <h2 className="font-semibold tracking-tighter">{vx?.nickname}</h2>
          </Link>
          <h3 className="text-sm font-light tracking-tighter">{vx?.email}</h3>
        </div>

        <CreateNewEvent pathname={pathname} account_id={vx?.account_id} />
      </div>
      <div
        id="user-pfp"
        className="absolute bottom-0 mx-10 size-32 rounded-full bg-background p-1"
      >
        <div className="flex size-full items-center justify-center overflow-clip rounded-full bg-primary-200">
          <AvatarOptions />
        </div>

        <Icon
          name="Squircle"
          className="absolute bottom-2 right-3 z-[50] flex size-[28px] -rotate-[5deg] items-center text-void drop-shadow-sm"
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
          className="group absolute bottom-[6px] right-[9.7px] z-50 -rotate-[5deg] data-[hover=true]:bg-transparent"
        >
          <Icon
            name="Pen"
            className="size-4 stroke-0 text-chalk group-hover:text-secondary"
          />
        </Button>
      </div>
      <PfpEditor title="Profile Picture" />
    </section>
  );
};
