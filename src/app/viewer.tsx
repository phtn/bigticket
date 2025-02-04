import { SideVaul } from "@/ui/vaul";
import { type ReactNode, use } from "react";
import { EventViewerCtx } from "./ctx/event";
import { FlatWindow } from "@/ui/window";
import { cn } from "@/lib/utils";
import { Icon } from "@/icons";
import { Card } from "@nextui-org/react";

export const EventViewer = () => {
  const { open, toggle } = use(EventViewerCtx)!;

  return (
    <SideVaul
      open={open}
      onOpenChange={toggle}
      direction="right"
      title={"Event Viewer"}
      description={"View event details."}
    >
      <FlatWindow
        closeFn={toggle}
        icon="Sparkles2"
        title=""
        className="rounded-b-none rounded-tl-md rounded-tr-none border-macd-gray"
        variant="goddess"
      >
        <Container>
          <div className="flex h-2/5 w-full items-center">
            <MediaContainer />
          </div>
          <div className="flex h-3/5 w-full overflow-scroll md:pb-0"></div>
        </Container>
      </FlatWindow>
    </SideVaul>
  );
};

const Container = ({ children }: { children: ReactNode }) => (
  <div
    className={cn(
      "h-[86.5vh]",
      "w-[calc(94vw)]",
      "sm:w-[calc(64vw)]",
      "md:w-[calc(54vw)]",
      "lg:w-[calc(44vw)]",
      "xl:w-[calc(40vw)]",
    )}
  >
    {children}
  </div>
);

const MediaContainer = () => {
  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-2xl font-medium text-transparent">
          Listing Details
        </h1>
        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-gray-900/5 p-2 transition-colors hover:bg-gray-900/10">
            <Icon name="BookmarkPlus" className="h-6 w-6 text-gray-600" />
          </button>
          <button className="rounded-lg bg-gray-900/5 p-2 transition-colors hover:bg-gray-900/10">
            <Icon name="Calendar" className="h-6 w-6 text-gray-600" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/5 transition-colors hover:bg-gray-900/10">
            <Icon name="Close" className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mb-8 h-[360px] rounded-2xl border border-gray-200/30 bg-gray-900/5 backdrop-blur-sm" />

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Sales", value: "780" },
          { label: "Revenue", value: "$45,650" },
          { label: "Total sales", value: "1,570" },
          { label: "Reviews", value: "380" },
          { label: "Views", value: "1,210" },
          { label: "Favorites", value: "2,680" },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-gray-200/30 bg-gray-900/[0.02] p-4 transition-colors hover:bg-gray-900/[0.04]"
          >
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-2xl font-medium text-transparent">
              {stat.value}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
