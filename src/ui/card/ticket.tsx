import { QrCodeGen } from "@/app/account/_components_/qr";
import { cn } from "@/lib/utils";
import { type ReactNode, useMemo } from "react";

interface TicketStackProps {
  title?: string;
  date?: string;
  day?: string;
  site?: string;
  time?: string;
  tickets?: number;
  color?: string;
}
export const TicketStack = ({
  title,
  date,
  tickets,
  time,
  site,
  day,
  color,
}: TicketStackProps) => {
  const url = useMemo(
    () => `https://${title}_${date}_${day}`,
    [title, date, day],
  );
  return (
    <div className="group relative flex h-fit w-full items-center justify-center">
      <div
        className={cn(
          "absolute h-[200px] w-[360px] -rotate-3 scale-95 rounded-2xl bg-indigo-300 shadow-lg transition-all duration-700 ease-out group-hover:rotate-[4deg] group-hover:shadow-md",
          color,
        )}
      />
      <Ticket tickets={tickets} color={color}>
        <div className="flex h-14 items-center justify-center rounded-xl rounded-b-2xl border-[0.33px] border-b-0 border-macl-gray px-2">
          <h1
            className={cn(
              "text-[38px] font-extrabold leading-none -tracking-wider",
              { "text-3xl": title && title.length >= 18 },
              { "text-2xl": title && title.length >= 23 },
              { "text-xl": title && title.length >= 27 },
            )}
          >
            {title}
          </h1>
        </div>
        <div className="h-4"></div>
        <div className="flex h-28 items-center rounded-xl rounded-t-2xl px-2">
          <div className="flex h-24 w-[6.25rem] flex-shrink-0 items-center justify-center rounded-s-md border-[0.33px] border-primary">
            {title && site && (
              <QrCodeGen url={url} logo="/icon/logomark_v2.svg" />
            )}
          </div>
          <div className="h-24 w-full rounded-e-md border-[0.33px] border-l-0 border-primary">
            <div className="flex h-1/2 w-full items-center border-b border-macl-gray px-2">
              <span className="text-lg font-extrabold -tracking-wider">
                {site}
              </span>
            </div>
            <div className="flex h-1/4 items-center justify-between whitespace-nowrap pe-2 ps-0.5">
              <span className="place-self-start font-mono text-[8px] italic tracking-tighter">
                Date|Time:
              </span>
              <span className="font-mono text-sm font-light tracking-tighter">
                {date}
              </span>
            </div>
            <div className="flex h-1/4 flex-shrink-0 items-center justify-end space-x-0.5 whitespace-nowrap px-1">
              <span className="text-xl font-extrabold -tracking-wider">
                {day}
              </span>
              <span className="text-lg font-extrabold -tracking-wider">
                {time}
              </span>
            </div>
          </div>
        </div>
      </Ticket>
    </div>
  );
};

interface TicketProps {
  children: ReactNode;
  tickets?: number;
  color?: string;
}
const Ticket = ({ children, tickets }: TicketProps) => {
  return (
    <div className="the-ticket absolute mt-[8px] h-[200px] w-[355px] rotate-2 scale-95 overflow-hidden rounded-2xl border-[0.33px] border-macl-gray bg-[#eee] p-2 transition-all duration-300 group-hover:rotate-0 group-hover:shadow-lg">
      <p className="absolute left-6 top-1 rounded-sm bg-[#eee] px-1 font-mono text-[8px] leading-none tracking-widest text-primary">
        authentic &middot; valid &middot; {tickets ? `1/${tickets}` : null}
      </p>

      {/* <div
        className={cn(
          "absolute -left-3 top-16 size-5 rounded-full bg-indigo-300",
          color,
        )}
      />
      <div
        className={cn(
          "absolute -right-3 top-16 size-5 rounded-full bg-indigo-300",
          color,
        )}
      /> */}
      <div className="absolute left-4 top-[72px] h-px w-[322] rounded-full border-b-2 border-dashed border-macd-gray/40" />
      {children}
    </div>
  );
};
