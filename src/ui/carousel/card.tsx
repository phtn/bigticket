import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel";
import { Image } from "@nextui-org/react";

interface CardCarouselProps {
  data: string[] | undefined;
}

export function CardCarousel({ data }: CardCarouselProps) {
  return (
    <div className="flex h-auto w-full items-center justify-center">
      <CarouselContent>
        {data?.map((photo, idx) => (
          <CarouselItem key={idx} className="h-fit p-0">
            <Image
              radius="none"
              alt={photo}
              src={photo}
              className="aspect-video h-[300px] w-auto flex-shrink-0 object-cover md:h-[440px]"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </div>
  );
}
