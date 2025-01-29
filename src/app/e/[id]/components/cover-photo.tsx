import { Icon } from "@/icons";
import { usePexels } from "@/lib/pexels";
import { CardCarousel } from "@/ui/carousel/card";
import { Spinner, Button } from "@nextui-org/react";

export const CoverPhoto = () => {
  const { images, loading } = usePexels();

  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      <div className="absolute">
        <Icon name="ImageIcon" className="size-24 opacity-20" />
      </div>
      <div className="absolute top-0 z-10 flex h-10 w-full items-center justify-between text-xs">
        <div className="flex h-7 items-center gap-2 rounded-e-full bg-white/20 pe-2 ps-1 font-semibold text-white backdrop-blur-md">
          Cover Photo
          {loading ? <Spinner size="sm" color="default" /> : null}
        </div>
        <div className="flex h-7 items-center rounded-full p-1.5 font-medium text-white backdrop-blur-md">
          <button className="group/check relative flex size-6 items-center justify-center rounded-full border border-white/60 bg-white/20 transition-all duration-300 hover:border-macl-mint">
            <p className="absolute flex h-6 -translate-x-20 -translate-y-16 items-center whitespace-nowrap rounded-full border border-foreground bg-macl-mint px-2 tracking-tight text-primary transition-all duration-300 group-hover/check:translate-y-0">
              Select this image
            </p>
            <Icon
              name="Check"
              className="size-3.5 text-white group-hover/check:text-macl-mint"
            />
          </button>
        </div>
      </div>

      <CardCarousel data={images} />

      <div className="flex_ absolute bottom-0 hidden h-12 w-full items-center justify-between border px-2">
        <p></p>
        <Button
          size="sm"
          variant="solid"
          color="primary"
          className="font-semibold opacity-100 hover:text-primary data-[hover=true]:bg-white data-[hover=true]:opacity-100"
        >
          Upload
          <Icon name="Upload" className="size-4" />
        </Button>
      </div>
    </div>
  );
};
