import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel";
import { Image } from "@nextui-org/react";
import { type Photo } from "pexels";

interface CardCarouselProps {
  data: Photo[] | undefined;
}

export function CardCarousel({ data }: CardCarouselProps) {
  return (
    <div className="flex size-full items-center justify-center object-cover">
      <CarouselContent className="flex-shrink-0 object-cover">
        {data?.map((photo, idx) => (
          <CarouselItem
            key={idx}
            className="size-full flex-shrink-0 bg-void p-0"
          >
            <Image
              alt={photo.alt ?? ""}
              src={photo.src.large}
              radius="none"
              className="flex-shrink-0 object-fill"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </div>
  );
}
