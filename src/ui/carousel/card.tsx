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
    <div className="flex h-full w-full items-center justify-center object-cover">
      <CarouselContent className="object-cover">
        {data?.map((photo, idx) => (
          <CarouselItem key={idx} className="h-fit bg-pink-400 p-0">
            <Image
              radius="none"
              alt={photo.alt ?? ""}
              src={photo.src.large}
              className="aspect-video h-[440px] w-auto flex-shrink-0 object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </div>
  );
}
