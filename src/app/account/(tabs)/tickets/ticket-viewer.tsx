import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { QrCodeGen } from "../../_components_/qr";
import { use } from "react";
import { TicketViewerCtx } from "./ctx";

export const TicketViewer = () => {
  const { ticket, open, toggle } = use(TicketViewerCtx)!;
  return (
    <SideVaul
      open={open}
      onOpenChange={toggle}
      direction="right"
      title={"Event Viewer"}
      description={"View event details."}
      dismissible
    >
      <FlatWindow
        closeFn={toggle}
        icon="QrCode"
        title={`Ticket Number: ${ticket?.ticket_id.split("-")[0]}`}
        variant="god"
        className="absolute z-50 w-full rounded-none border-0 bg-transparent text-primary"
        wrapperStyle="border-gray-500 md:border-l-2"
      >
        <div className="flex h-[calc(100vh-64px)] w-screen flex-col items-center justify-start overflow-hidden overflow-y-scroll bg-primary py-20 md:w-[30rem]">
          <div className="flex w-fit items-center rounded-[2.20rem] border border-primary bg-white">
            <QrCodeGen
              url={ticket?.ticket_url}
              logo="/icon/logomark_v2.svg"
              width={360}
              height={360}
            />
          </div>
          <div className="flex h-24 w-full"></div>
          <div className="flex h-14 w-full items-center justify-center gap-4 bg-secondary font-inter font-bold uppercase tracking-tighter text-white">
            <span>valid ticket</span>
            <span>&middot;</span>
            <span>admit one</span>
          </div>
        </div>
      </FlatWindow>
    </SideVaul>
  );
};
