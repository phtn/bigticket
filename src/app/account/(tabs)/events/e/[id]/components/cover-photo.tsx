import { Icon } from "@/icons";
import { usePexels } from "@/lib/pexels";
import { useCarousel } from "@/ui/carousel";
import { CardCarousel } from "@/ui/carousel/card";
import { Spinner } from "@nextui-org/react";
import { type ChangeEvent, use, useCallback, useEffect, useMemo, useRef } from "react";
import { EventEditorCtx } from "../ctx";
import { Err } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { getAverageColor, isLightColor } from "@/hooks/useImage";

interface CoverPhotoProps {
  id: string | undefined;
  cover_url: string | undefined;
}

export const CoverPhoto = ({ id, cover_url }: CoverPhotoProps) => {
  const {
    query,
    locale,
    getRefs,
    cover_src,
    uploading,
    getCoverPhoto,
    uploadFromFile,
    uploadFromSource,
    onInputFileChange,
    updateTextColor,
    browseFile,
  } = use(EventEditorCtx)!;

  const { images, loading } = usePexels({ query, locale });
  const { currentIndex } = useCarousel();
  const { toggle } = use(SidebarCtx)!;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getRefs({ canvasRef, inputFileRef });
  }, [canvasRef, inputFileRef, getRefs]);

  useEffect(() => {
    getCoverPhoto(cover_url).catch(Err);
  }, [cover_url, getCoverPhoto, cover_src]);

  const src = useMemo(
    () => images?.[cover_src ? currentIndex - 1 : currentIndex]?.src.large,
    [images, currentIndex, cover_src],
  );

  const handleImageSelect = useCallback(async () => {
    if (!src) return;
    const img = document.createElement('img');
    img.src = src;
    img.crossOrigin = "Anonymous";
    let lightText = false;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const sampleWidth = 100;
        const sampleHeight = 400;
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight, 0, 0, sampleWidth, sampleHeight);
        const { r, g, b } = getAverageColor(ctx, sampleWidth, sampleHeight);
        lightText = isLightColor(r, g, b);
      }
    }
    await updateTextColor(id, lightText);
    await uploadFromSource(src, id, "cover_url");
  }, [src, id, uploadFromSource, updateTextColor]);

  const onChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = onInputFileChange(e)
      await uploadFromFile(file, id, "cover_url");
    },
    [id, onInputFileChange, uploadFromFile],
  );

  const allImages = useMemo(() => {
    const imageList = images?.slice().map((image) => image.src.large);
    if (!cover_src) return imageList;
    imageList?.unshift(cover_src);
    return imageList;
  }, [images, cover_src]);

  const isCurrentCover = useMemo(() => {
    return cover_src !== null && currentIndex === 0;
  }, [cover_src, currentIndex]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-macl-gray bg-gradient-to-tr from-tan via-macl-pink to-macl-purple">
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
            disabled={isCurrentCover}
            onClick={handleImageSelect}
            className="group/check relative flex size-6 items-center justify-center rounded-full border border-primary bg-primary transition-all duration-300 hover:border-white"
          >
            <p className="absolute flex h-6 -translate-x-20 -translate-y-16 items-center whitespace-nowrap rounded-full border border-primary bg-white px-2 tracking-tighter text-primary transition-all duration-300 group-hover/check:translate-y-0">
              Select this image
            </p>
            {uploading ? (
              <Spinner size="sm" color="default" />
            ) : (
              <Icon
                name="Check"
                className={cn(
                  "size-3.5 text-white group-hover/check:text-macl-mint",
                  { "text-secondary": isCurrentCover },
                )}
              />
            )}
          </button>
        </div>
      </div>

      <CardCarousel data={allImages} />

      <div className="absolute bottom-0 flex h-12 w-full items-end justify-between px-2 pb-2">
        <div className="flex">
          <p className="rounded-sm border border-gray-200/60 px-0.5 font-mono text-[10px] text-chalk">
            {currentIndex + 1}/{allImages?.length}
          </p>
        </div>
        <div className="relative flex max-w-40 items-center gap-1.5 overflow-hidden">
          <ButtonIcon
            onClick={toggle}
            icon="Sparkle"
            bg="opacity-50 text-primary group-hover/icon:opacity-100"
            color="text-chalk"
          />

          <ButtonIcon
            onClick={browseFile}
            icon="ImageUpload"
            bg="opacity-50 text-primary group-hover/icon:opacity-100"
            color="text-chalk"
          >
            Upload
            <Icon name="Upload" className="size-4" />
          </ButtonIcon>
          <input
            type="file"
            ref={inputFileRef}
            onChange={onChange}
            className="pointer-events-none absolute right-0 size-1 cursor-pointer bg-secondary opacity-0"
          />
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute hidden" />
    </div>
  );
};
