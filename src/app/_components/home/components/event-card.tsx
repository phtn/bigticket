import { Icon } from "@/icons";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";

export const EventCard = () => (
  <Card
    isFooterBlurred
    className="h-[280px] w-full rounded-[2.5rem] border border-primary-700"
  >
    <CardHeader className="absolute left-2 top-2 z-10 flex-col items-start">
      <p className="text-tiny font-bold uppercase text-white/60">
        All night Rave + dj Youna
      </p>
      <h4 className="text-xl font-medium capitalize text-white/90">
        Chain breaker night
      </h4>
    </CardHeader>
    <Image
      removeWrapper
      radius="none"
      alt="nightlife"
      className="z-0 h-full w-full border-0 object-cover"
      src="https://tripjive.com/wp-content/uploads/2024/11/How-can-I-enjoy-Boracays-nightlife.jpg"
    />
    <CardFooter className="absolute bottom-0 z-10 border-t-1 border-primary/60 bg-black/40">
      <div className="flex flex-grow items-center gap-2">
        <Image
          alt="Breathing app icon"
          className="h-11 w-full rounded-full bg-black"
          src="https://nextui.org/images/breathing-app-icon.jpeg"
        />
        <div className="flex flex-col">
          <p className="text-tiny font-bold text-white/70">X Club</p>
          <p className="text-tiny uppercase text-white/70">
            SAT &middot; feb 1 &middot; 9pm-3am
          </p>
        </div>
      </div>
      <Button
        size="sm"
        isIconOnly
        radius="full"
        color="secondary"
        className="flex items-center font-inter font-semibold tracking-tighter"
      >
        <Icon name="ArrowRight" className="size-4" />
      </Button>
    </CardFooter>
  </Card>
);
