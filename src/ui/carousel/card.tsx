import {
  Carousel,
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
    <Carousel>
      <CarouselContent>
        {data?.map((photo, idx) => (
          <CarouselItem key={idx} className="bg-void object-cover p-0">
            <Image alt={photo.alt ?? ""} src={photo.src.large} radius="none" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
