"use client";

import { Icon } from "@/icons";
import { cn } from "@/lib/utils";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Icon name="Fire" className="text-macl-mint size-4" />,
  title = "Featured",
  description = "This is a skewed card with some text",
  date = "Sep 23",
  titleClassName = "text-green-500",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "border-primary-300 hover:bg-ghost via-vanilla/40 to-cake from-peach/10 relative flex h-36 w-[22rem] select-none flex-col justify-between rounded-xl border bg-gradient-to-br px-4 py-3 backdrop-blur-lg transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-white after:to-transparent after:content-[''] [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className,
      )}
    >
      <div>
        <span className="bg-primary relative inline-block rounded-full p-1">
          {icon}
        </span>
        <p className={cn("text-lg", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg">{description}</p>
      <p className="text-muted-foreground">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] hover:mb-44 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] shadow-md translate-y-16 hover:mb-24 hover:translate-y-6 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-y-32 _hover:translate-y-24",
    },
  ];

  const displayCards = cards ?? defaultCards;

  return (
    <div className="animate-in fade-in-0 grid place-items-center opacity-100 duration-700 [grid-template-areas:'stack']">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}