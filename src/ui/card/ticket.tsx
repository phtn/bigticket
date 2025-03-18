import { QrCodeGen } from "@/app/account/_components_/qr";
import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";
import { type ReactNode, useCallback } from "react";

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
  const url = `https://${title}_${date}_${day}`;
  const QrOptions = useCallback(() => {
    const options = opts(<QrCodeGen url={url} />, null);
    return <>{options.get(typeof title !== "undefined" && !!site)}</>;
  }, [title, site, url]);

  return (
    <div className="group relative flex h-fit w-full items-center justify-center">
      <div
        className={cn(
          "absolute h-[210px] w-[350px] -rotate-3 scale-95 rounded-2xl bg-indigo-300 shadow-lg transition-all duration-700 ease-out group-hover:rotate-[5deg] group-hover:shadow-md",
          color,
        )}
      />
      <Ticket tickets={tickets} color={color}>
        <div className="flex h-14 items-center justify-center rounded-xl rounded-b-lg border border-macl-gray bg-chalk px-2">
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
        <div className="h-3"></div>
        <div className="flex h-28 items-end rounded-xl rounded-t-xl">
          <div className="flex h-[100px] w-[6.25rem] flex-shrink-0 items-center justify-center rounded-s-md border border-macd-gray bg-chalk">
            <QrOptions />
          </div>
          <div className="h-[100px] w-full rounded-e-md border border-l-0 border-macd-gray bg-chalk">
            <div className="flex h-1/2 w-full items-center border-b border-macl-gray px-2">
              <span className="text-lg font-extrabold -tracking-wider">
                {site}
              </span>
            </div>
            <div className="flex h-1/4 items-center justify-between whitespace-nowrap px-1">
              <span className="place-self-start font-mono text-[8px] italic tracking-tighter">
                Date|Time:
              </span>
              <span className="font-inter text-sm font-semibold tracking-tighter">
                {date}
              </span>
            </div>
            <div className="flex h-1/4 items-center justify-end gap-1 space-x-0.5 whitespace-nowrap px-1 text-xl font-extrabold -tracking-wider">
              <span>{day?.substring(0, 3)}</span>
              <span className="">&middot;</span>
              <span>{time}</span>
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
    <div className="the-ticket absolute mt-[8px] h-[220px] w-[360px] rotate-2 scale-90 overflow-hidden rounded-2xl border-[0.33px] border-macl-gray bg-[#eee] p-2 shadow-md shadow-primary transition-all duration-500 ease-out group-hover:rotate-0 group-hover:shadow-xl md:group-hover:scale-95">
      <p className="absolute left-6 top-1 rounded-sm bg-[#eee] px-1 font-mono text-[8px] leading-none tracking-widest text-primary">
        authentic &middot; valid &middot; {tickets ? `1/${tickets}` : null}
      </p>
      <div className="absolute top-[64px] flex h-fit w-[335] items-center justify-center rounded-full text-macl-gray">
        {`┄ `.repeat(16)}
      </div>

      {children}
    </div>
  );
};
//┅
