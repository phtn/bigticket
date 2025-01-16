import { Icon } from "@/icons";
import { MorphingText } from "@/ui/text/morph";

interface HeroProps {
  headline: string;
  keywords: string[];
}
export const Hero = ({ headline, keywords }: HeroProps) => (
  <div className="flex h-fit w-full items-center justify-center border px-6 font-inter">
    <div className="h-24 border px-2">
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-1 text-lg font-semibold tracking-tight text-primary">
        <Icon name="TicketFill" className="size-6 stroke-0 text-orange-400" />
        {headline}
      </span>
    </div>
    <MorphingText texts={keywords} />
  </div>
);
