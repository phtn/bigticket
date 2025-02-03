import { Icon } from "@/icons";
import { usePexels } from "@/lib/pexels";
import { useCarousel } from "@/ui/carousel";
import { CardCarousel } from "@/ui/carousel/card";
import { Spinner, Button } from "@nextui-org/react";
import { use, useCallback, useMemo } from "react";
import { EventEditorCtx } from "../ctx";

export const CoverPhoto = ({ id }: { id: string | undefined }) => {
  const { query, locale } = use(EventEditorCtx)!;
  const { images, loading } = usePexels({ query, locale });
  const { currentIndex } = useCarousel();

  const { createUpload, uploading } = use(EventEditorCtx)!;
  const src = useMemo(
    () => images?.[currentIndex]?.src.large,
    [images, currentIndex],
  );

  const handleImageSelect = useCallback(async () => {
    await createUpload(src, id, "cover_url");
  }, [src, id, createUpload]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-tr from-tan via-macl-pink to-macl-purple">
      <div className="absolute hidden">
        <Icon name="ImageIcon" className="size-24 opacity-20" />
      </div>

      <div className="absolute top-0 z-10 flex h-10 w-full items-center justify-between pe-2 text-xs">
        <div className="flex h-7 items-center gap-2 rounded-e-full bg-white/20 pe-2 ps-1 font-semibold text-white backdrop-blur-md">
          Cover Photo
          {loading ? <Spinner size="sm" color="default" /> : null}
        </div>
        <div className="flex h-7 items-center rounded-full font-medium text-white backdrop-blur-md">
          <button
            onClick={handleImageSelect}
            className="group/check relative flex size-6 items-center justify-center rounded-full border border-white/60 bg-primary transition-all duration-300 hover:border-white"
          >
            <p className="absolute flex h-6 -translate-x-20 -translate-y-16 items-center whitespace-nowrap rounded-full border border-foreground bg-white px-2 tracking-tighter text-primary transition-all duration-300 group-hover/check:translate-y-0">
              Select this image
            </p>
            {uploading ? (
              <Spinner size="sm" color="default" />
            ) : (
              <Icon
                name="Check"
                className="size-3.5 text-white group-hover/check:text-macl-mint"
              />
            )}
          </button>
        </div>
      </div>

      <CardCarousel data={images} />

      <div className="absolute bottom-0 flex h-12 w-full items-end justify-between px-2 pb-2">
        <div className="flex">
          <p className="rounded-sm border border-gray-200/60 px-0.5 font-mono text-[10px] text-chalk">
            {currentIndex + 1}/15
          </p>
        </div>
        <Button
          size="sm"
          variant="solid"
          color="primary"
          className="opacity-100 hover:text-primary data-[hover=true]:bg-white data-[hover=true]:opacity-100"
        >
          Upload
          <Icon name="Upload" className="size-4" />
        </Button>
      </div>
    </div>
  );
};
