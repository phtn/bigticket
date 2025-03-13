import { useConvexCtx } from "@/app/ctx/convex";
import { onSuccess, onWarn } from "@/app/ctx/toast";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err } from "@/utils/helpers";
import { Checkbox, Form } from "@nextui-org/react";
import type { EventGallery } from "convex/events/d";
import { useActionState, useReducer, useState } from "react";
import { media_fields, MediaZod } from "../schema";
import { Nebula } from "../";
import { MediaBlock } from "./components";
import { mediaReducer } from "./reducer";
import type {
  MediaContentProps,
  MediaListProps,
  MediaFormState,
} from "./types";

export const MediaContent = ({ xEvent }: MediaContentProps) => {
  const { vxEvents } = useConvexCtx();

  const [loading, setLoading] = useState(false);
  const [mediaList, dispatch] = useReducer(mediaReducer, []);

  const initialState: MediaFormState = {
    title: "",
    description: "",
    src: "",
    alt: "",
  };

  const addMedia = async (
    initialState: MediaFormState | undefined,
    fd: FormData,
  ) => {
    setLoading(true);
    const formData = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      src: fd.get("src") as string,
      alt: fd.get("alt") as string,
    };

    const validatedData = MediaZod.safeParse(formData);

    if (!validatedData.success) {
      console.error(validatedData.error);
      return;
    }

    if (validatedData.data.src === "") {
      onWarn("Source cannot be empty");
      return;
    }

    if (!xEvent?.event_id) return;

    const newMedia: EventGallery = {
      ...validatedData.data,
      index: (xEvent?.gallery?.length ?? 0) + 1,
    };

    try {
      await vxEvents.mut.updateEventGallery({
        id: xEvent.event_id,
        media: newMedia,
      });
      dispatch({ type: "ADD_MEDIA", payload: newMedia });
      onSuccess("Added Media");
      setLoading(false);
      return formData;
    } catch (error) {
      Err(
        setLoading,
        error instanceof Error ? error.message : "An error occurred.",
      );
    }
  };

  const [, action, pending] = useActionState(addMedia, initialState);

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
                  disabled={pending || loading}
                  loading={pending || loading}
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
          <MediaList data={mediaList} />
        </div>
      </Form>
    </Nebula>
  );
};

const MediaList = ({ data }: MediaListProps) => {
  return (
    <section className="relative col-span-3 border-vanilla/20 text-chalk md:border-y md:border-r">
      <div className="h-96 w-full overflow-hidden overflow-y-scroll">
        <div className="flex h-11 w-full items-center justify-between border-b-3 border-vanilla/20 px-3 font-inter text-tiny font-bold">
          <div className="flex items-center gap-4">
            <span>Media Gallery</span>
          </div>
        </div>
        <HyperList data={data} component={MediaListItem} container="" />
      </div>
    </section>
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
