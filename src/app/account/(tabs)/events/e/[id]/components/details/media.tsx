import { useConvexCtx } from "@/app/ctx/convex";
import { onSuccess, onWarn } from "@/app/ctx/toast";
import { type XEvent } from "@/app/types";
import { type IconName } from "@/icons";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err } from "@/utils/helpers";
import { Checkbox, Form, Input } from "@nextui-org/react";
import type { EventGallery } from "convex/events/d";
import { useActionState, useCallback, useState } from "react";
import { inputClassNames } from "../../editor";
import { BlockHeader } from "./components";
import { media_fields, type MediaField, MediaZod } from "./schema";
import { Nebula } from ".";

interface MediaBlockProps {
  data: MediaField[];
  label: string;
  icon: IconName;
  delay?: number;
}
interface MediaContentProps {
  xEvent: XEvent | null;
  user_id: string | null;
}

export const MediaContent = ({ xEvent }: MediaContentProps) => {
  const initialState: EventGallery = {
    title: "",
    description: "",
    src: "",
    alt: "",
  };

  const { vxEvents } = useConvexCtx();

  const [mediaList, setMediaList] = useState<EventGallery[]>([]);

  const updateMediaList = useCallback(
    async (data: EventGallery) => {
      if (!xEvent?.event_id) return;
      setMediaList([...mediaList, data]);
      return await vxEvents.mut.updateEventGallery({
        id: xEvent.event_id,
        media: data,
      });
    },
    [xEvent?.event_id, vxEvents.mut, mediaList],
  );
  //Above The Neon City
  //12 Hours - 4K Ultra HD 60fps
  // pwuFTsvJL34
  // above-the-neon-city

  const addMedia = (initialState: EventGallery | undefined, fd: FormData) => {
    const m = MediaZod.safeParse({
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      src: fd.get("src") as string,
      alt: fd.get("alt") as string,
    });

    if (m.error) {
      console.log(m.error);
      return;
    }

    if (m.data.src === "") {
      onWarn("Source cannot be empty");
      return;
    }
    updateMediaList({
      ...m.data,
      // index: xEvent?.gallery?.length || 0
      index: (xEvent?.gallery?.length ?? 0) + 1,
    })
      .then(() => {
        onSuccess("Added Media");
      })
      .catch(Err);
    return {
      ...m.data,
    };
  };
  const [, action, pending] = useActionState(addMedia, initialState);

  // const addMediaToGallery = useCallback(() => {
  //   setMedia([...media, g]);
  // }, [media]);

  return (
    <Nebula>
      <Form action={action}>
        <div className="_gap-10 grid h-full w-full grid-cols-1 md:grid-cols-5 md:gap-0 md:rounded">
          <section className="col-span-2 h-fit space-y-8 border-b-[0.33px] border-vanilla/20 md:h-fit md:border-[0.33px]">
            <MediaBlock
              data={media_fields}
              label="Add Multimedia Assets"
              icon="Play"
            />

            <div className="flex h-1/6 w-full items-end justify-between">
              <div className="flex w-full items-center border-t-[0.33px] border-vanilla/20 text-chalk">
                <div className="flex h-14 w-full items-center justify-between gap-3 border-r-[0.33px] border-vanilla/20 px-3">
                  <p className="font-inter text-xs font-semibold tracking-tight">
                    Items in Gallery
                  </p>
                  <p className="font-sans text-sm">
                    {xEvent?.gallery?.length ?? 0}
                  </p>
                </div>
                <Hyper
                  disabled={pending}
                  loading={pending}
                  type="submit"
                  label="Add"
                  end="Plus"
                  fullWidth
                  dark
                  xl
                />
              </div>
            </div>
          </section>
          <section className="relative col-span-3 border-vanilla/20 text-chalk md:border-y md:border-r">
            <div className="h-96 w-full overflow-hidden overflow-y-scroll">
              <div className="flex h-11 w-full items-center justify-between border-b-3 border-vanilla/20 px-3 font-inter text-tiny font-bold">
                <div className="flex items-center gap-4">
                  <span>Media Gallery</span>
                </div>
              </div>
              <HyperList
                data={xEvent?.gallery ?? mediaList ?? []}
                component={MediaListItem}
                container=""
              />
            </div>
          </section>
        </div>
      </Form>
    </Nebula>
  );
};

const MediaListItem = (gallery: EventGallery) => {
  return (
    <div className="grid w-full grid-cols-12 overflow-clip border-b-[0.33px] border-dotted border-vanilla/20">
      <div className="col-span-1 flex h-10 w-full items-center justify-start rounded-sm hover:bg-gray-300/10">
        <p className="px-1 font-inter text-xs tracking-tight opacity-60">
          {gallery.index}
        </p>
      </div>
      <div className="col-span-4 flex h-10 w-full items-center rounded-sm hover:bg-gray-300/10">
        <p className="px-3 font-inter text-xs font-semibold tracking-tight">
          {gallery.title}
        </p>
      </div>
      <div className="col-span-5 flex h-10 w-full items-center px-3 hover:bg-gray-300/10">
        <p className="font-inter text-xs font-semibold tracking-tight">
          {gallery.src}
        </p>
      </div>
      <div className="col-span-2 flex h-10 w-full items-center justify-end hover:bg-gray-300/10">
        <Checkbox
          name={gallery.src}
          color="primary"
          className="border-0 bg-transparent"
          classNames={{
            icon: "text-peach",
            wrapper: "border border-gray-600",
          }}
        />
      </div>
    </div>
  );
};

const MediaItem = (field: MediaField) => {
  return (
    <Input
      id={field.name}
      label={field.label}
      name={field.name}
      type={field.type}
      autoComplete={field.name}
      classNames={inputClassNames}
      placeholder={field.placeholder}
      isRequired={field.required}
      defaultValue={field.defaultValue}
      validationBehavior="native"
      className="appearance-none"
    />
  );
};
const MediaBlock = ({ data, icon, label, delay = 0 }: MediaBlockProps) => (
  <div className="h-5/6 w-full space-y-6 p-6">
    <BlockHeader label={label} icon={icon} />
    <section className="h-fit rounded bg-gray-400/10 px-4 py-3 text-justify text-tiny text-vanilla md:p-4 md:text-sm">
      This feature currently works for YouTube videos. You can upload your own
      videos or use videos from YouTube by providing the video ID.
    </section>
    <HyperList
      data={data}
      container="space-y-6"
      itemStyle="whitespace-nowrap"
      component={MediaItem}
      delay={delay}
      keyId="name"
    />
  </div>
);
