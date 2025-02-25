import { Y } from "@/app/_components_/y";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel";
import { Image } from "@nextui-org/react";
import { type RefObject, type FC } from "react";

export interface MediaItem {
  title?: string;
  description?: string;
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface CarouselProps {
  data: MediaItem[];
  ref: RefObject<HTMLDivElement | null>;
}

const MultiMediaCarousel: FC<CarouselProps> = ({ data, ref }) => {
  return (
    <div ref={ref} className="relative h-[250px] w-full bg-tan">
      <CarouselContent>
        {data?.map((item, idx) => (
          <CarouselItem
            key={idx}
            className="flex aspect-auto size-full items-center justify-center"
          >
            {item.type === "image" ? (
              <Image
                radius="none"
                alt={item.alt ?? "carousel image"}
                src={item.src}
                className="relative z-0 aspect-auto w-screen flex-shrink-0 grow object-fill md:w-[30rem]"
              />
            ) : (
              <Y src={item.src} ref={ref} idx={idx} />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </div>
  );
};

export default MultiMediaCarousel;
