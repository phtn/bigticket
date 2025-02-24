"use client";

import { getUserID } from "@/app/actions";
import { type XEvent } from "@/app/types";
import { useMoment } from "@/hooks/useMoment";
import { Carousel } from "@/ui/carousel";
import { Err } from "@/utils/helpers";
import {
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type JSX,
} from "react";
import { CoverPhoto } from "./components/cover-photo";
import { EventDetails } from "./components/details";
import {
  EventCategory,
  EventDetailActionSheet,
  type EventDetailButtonProps,
  EventDetailOption,
} from "./components/details/action-sheet";
import { BasicContent } from "./components/details/basic";
import {
  EventDetailCtx,
  EventDetailCtxProvider,
  type EventDetailKey,
} from "./components/details/ctx";
import { VIPContent } from "./components/details/vip";
import { ImageQuery } from "./components/pexels";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtx } from "./ctx";

export interface TabItem {
  title: string;
  value: string;
  content: JSX.Element;
}

interface EventEditorProps {
  id: string | undefined;
}
export const EventEditor = ({ id }: EventEditorProps) => {
  const [event_id] = id?.split("---") ?? [];
  const { getXEvent, xEvent, pending } = use(EventEditorCtx)!;
  const [user_id, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getXEvent(event_id);
  }, [getXEvent, event_id]);

  const getUserId = useCallback(async () => {
    setUserId(await getUserID());
  }, []);

  useEffect(() => {
    getUserId().catch(Err);
  }, [getUserId]);

  const tabs: TabItem[] = useMemo(
    () => [
      {
        value: "info",
        title: "Info",
        content: <BasicContent xEvent={xEvent} pending={pending} />,
      },
      {
        value: "tickets",
        title: "Tickets",
        content: <BasicContent xEvent={xEvent} pending={pending} />,
      },
      {
        value: "vips",
        title: "VIPs",
        content: <VIPContent xEvent={xEvent} user_id={user_id} />,
      },
      {
        value: "test",
        title: "TEST",
        content: <TestTab xEvent={xEvent} />,
      },
    ],
    [user_id, xEvent, pending],
  );

  return (
    <main className="h-full bg-gray-200">
      <Topbar event_name={xEvent?.event_name} />
      <ImageQuery category={xEvent?.category} />

      <div className="space-y-8">
        <div className="h-fit md:px-4">
          <Carousel>
            <div className="grid h-fit w-full grid-cols-1 gap-10 md:min-h-[400px] md:grid-cols-2 md:gap-6 md:px-4">
              <CoverPhoto id={event_id} cover_url={xEvent?.cover_url} />
              <TicketPhoto xEvent={xEvent} />
            </div>
          </Carousel>
        </div>

        <div className="h-fit md:px-8">
          <EventDetailCtxProvider>
            <EventDetails tabs={tabs} />
          </EventDetailCtxProvider>
        </div>
      </div>
    </main>
  );
};

interface TestTabProps {
  xEvent: XEvent | null;
}
const TestTab = ({ xEvent }: TestTabProps) => {
  const [category, setCategory] = useState(xEvent?.category);
  const { selectedEventDetail } = use(EventDetailCtx)!;

  const detail_data = useMemo(() => [], []);

  const handleCategoryChange = () => {
    console.log("");
  };
  const renderDetailFields = useCallback(() => {
    switch (selectedEventDetail) {
      case "category":
        return (
          <EventCategory value={category} onChange={handleCategoryChange} />
        );
    }
  }, [selectedEventDetail, category]);
  return (
    <div className="grid w-full grid-cols-1 gap-6 bg-ticket md:grid-cols-2 md:rounded-lg">
      <EventDetailFields render={renderDetailFields} data={detail_data}>
        <div></div>
      </EventDetailFields>
    </div>
  );
};

type EventDetailFieldData = string | number | boolean | undefined;
interface EventDetailFieldProps {
  children: ReactNode;
  render: (option: EventDetailKey | null) => ReactNode;
  data: EventDetailFieldData[];
}

const EventDetailFields = ({
  children,
  render,
  data,
}: EventDetailFieldProps) => {
  const { selectedEventDetail } = use(EventDetailCtx)!;
  const { start_time, end_time } = useMoment({
    start: data[3] as number,
    end: data[4] as number,
  });

  const fields: EventDetailButtonProps[] = useMemo(
    () => [
      {
        label: "Tickets",
        value: String(data[0]),
        name: "ticket_count",
      },
      {
        label: "Event Type",
        value: data[1] as string,
        name: "event_type",
      },
      {
        label: "Category",
        value: data[2] as string,
        name: "category",
      },
      {
        label: "Start Time",
        value: `${start_time.date} · ${start_time.full}`,
        name: "start_date",
      },
      {
        label: "End Time",
        value: `${end_time.date} · ${end_time.full}`,
        name: "end_date",
      },
    ],
    [data, end_time, start_time],
  );

  return (
    <div className="w-full space-y-4">
      <div className="grid w-full grid-cols-3 gap-3 md:px-2">
        {fields.slice(0, 3).map((option) => (
          <EventDetailOption
            key={option.name}
            label={option.label}
            value={option.value}
            name={option.name}
          />
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-3 md:px-2">
        {fields.slice(3).map((option) => (
          <EventDetailOption
            key={option.name}
            label={option.label}
            value={option.value}
            name={option.name}
          />
        ))}
      </div>
      <EventDetailActionSheet>
        {render(selectedEventDetail)}
        {children}
      </EventDetailActionSheet>
    </div>
  );
};
export const inputClassNames = {
  innerWrapper: "border-0 bg-white p-3 shadow-none rounded-xl",
  inputWrapper: "h-16 p-0 bg-white data-hover:bg-white shadow-none",
  label: "ps-3 pb-0.5 opacity-60 text-sm tracking-tight",
  input:
    "font-bold tracking-tight placeholder:font-semibold shadow-none focus:placeholder:opacity-40 placeholder:text-primary font-inter placeholder:text-sm",
};
