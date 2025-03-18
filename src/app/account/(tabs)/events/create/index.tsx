"use client";

import { useDime } from "@/hooks/useDime";
import { useMoment } from "@/hooks/useMoment";
import { useToggle } from "@/hooks/useToggle";

import { cn } from "@/lib/utils";
import { TicketStack } from "@/ui/card/ticket";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { opts } from "@/utils/helpers";
import { Button, Form, Input, Textarea } from "@nextui-org/react";
import type { InsertEvent } from "convex/events/d";
import {
  use,
  useActionState,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useEvent } from "../../../useEvent";
import {
  ensureValidEndTime,
  EventCategory,
  EventDate,
  EventType,
  inputClassNames,
  OptionActionSheet,
  OptionButton,
  TicketCount,
  type OptionButtonProps,
} from "./components";
import { OptionCtx, OptionCtxProvider, type OptionKey } from "./ctx";
import { Iconx } from "@/icons";

export const CreateEvent = () => {
  const { open, toggle } = useToggle();
  const [eventName, setEventName] = useState("");
  const [ticketCount, setTicketCount] = useState(50);
  const [eventType, setEventType] = useState("onsite");
  const [eventCategory, setEventCategory] = useState("party");
  const [eventStartDate, setEventStartDate] = useState(Date.now());
  const [eventEndDate, setEventEndDate] = useState(Date.now() + 3600000);
  const [eventSite, setEventSite] = useState("");

  const { event_time, event_day, narrow } = useMoment({
    start: eventStartDate,
    end:
      eventEndDate < eventStartDate ? eventStartDate + 36000000 : eventEndDate,
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  }, []);

  const handleChangeSite = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEventSite(e.target.value);
  }, []);

  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const { createEvent } = useEvent();

  const initialState: InsertEvent = {
    event_id: "",
    event_name: undefined,
    start_date: 0,
    end_date: 0,
    event_type: "",
    event_geo: "",
    event_url: "",
    ticket_count: 0,
    category: "",
  };
  const fn = async (initialState: InsertEvent, fd: FormData) => {
    const data: InsertEvent = {
      event_id: "",
      event_name: fd.get("event_name") as string,
      event_geo: (fd.get("event_geo") as string) ?? undefined,
      event_url: (fd.get("event_url") as string) ?? undefined,
    };

    await createEvent({
      ...data,
      start_date: eventStartDate,
      end_date:
        eventEndDate < eventStartDate
          ? eventStartDate + 36000000
          : eventEndDate,
      ticket_count: ticketCount,
      event_type: eventType,
      category: eventCategory,
    });
    return data;
  };

  const [state, action, pending] = useActionState(fn, initialState);

  const EventSite = useCallback(() => {
    const options = opts(
      <Input
        required
        size="lg"
        id="event_geo"
        name="event_geo"
        label="Event place / venue"
        placeholder="The place where the event will take place."
        onChange={handleChangeSite}
        classNames={inputClassNames}
      />,
      <Input
        size="lg"
        id="event_url"
        name="event_url"
        label="Website"
        placeholder="Link to your website"
        onChange={handleChangeSite}
        classNames={inputClassNames}
      />,
    );
    return <>{options.get(eventType === "onsite")}</>;
  }, [eventType, handleChangeSite]);

  const ref = useRef<HTMLDivElement | null>(null);
  const { screen, dimensions } = useDime();

  const contentHeight = useMemo(
    () => `${((screen.height - (64 + dimensions.height)) / 8).toFixed(2)}px`,
    [screen.height, dimensions.height],
  );
  const adjustedEndTime = useMemo(
    () => ensureValidEndTime(eventStartDate, eventEndDate),
    [eventStartDate, eventEndDate],
  );

  const option_value_data = useMemo(
    () => [
      ticketCount,
      eventType,
      eventCategory,
      eventStartDate,
      eventEndDate < eventStartDate ? adjustedEndTime : eventEndDate,
    ],
    [
      ticketCount,
      eventType,
      eventCategory,
      eventStartDate,
      eventEndDate,
      adjustedEndTime,
    ],
  );

  const handleCustomTicketCount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTicketCount(+e.target.value);
    },
    [],
  );
  const handleSelectTicketCount = useCallback(
    (value: number) => (e: MouseEvent) => {
      e.preventDefault();
      setTicketCount(value);
    },
    [],
  );
  const handleSelectEventType = useCallback((value: string) => {
    setEventType(value);
  }, []);
  const handleSelectEventCategory = useCallback((value: string) => {
    setEventCategory(value);
  }, []);
  const handleChangeStartDate = useCallback((value: number) => {
    setEventStartDate(value);
  }, []);
  const handleChangeEndDate = useCallback((value: number) => {
    setEventEndDate(value);
  }, []);

  const renderOptions = useCallback(
    (option: OptionKey | null) => {
      switch (option) {
        case "ticket_count":
          return (
            <TicketCount
              ticketCount={ticketCount}
              handleSelectTicketCount={handleSelectTicketCount}
              handleCustomTicketCount={handleCustomTicketCount}
            />
          );
        case "event_type":
          return (
            <EventType value={eventType} onChange={handleSelectEventType} />
          );
        case "category":
          return (
            <EventCategory
              value={eventCategory}
              onChange={handleSelectEventCategory}
            />
          );
        case "start_date":
          return (
            <EventDate
              label="Start"
              value={eventStartDate}
              onChange={handleChangeStartDate}
            />
          );
        case "end_date":
          return (
            <EventDate
              label="End"
              value={eventEndDate}
              onChange={handleChangeEndDate}
            />
          );
        default:
          return <div className="bg-gray-200 p-2">{option}</div>;
      }
    },
    [
      ticketCount,
      eventType,
      eventCategory,
      eventEndDate,
      eventStartDate,
      handleSelectTicketCount,
      handleCustomTicketCount,
      handleSelectEventType,
      handleSelectEventCategory,
      handleChangeEndDate,
      handleChangeStartDate,
    ],
  );

  return (
    <div className="flex w-full items-center justify-end font-inter xl:space-x-1">
      <button
        className="group/create flex size-6 items-center justify-center rounded-lg bg-teal-500 px-0 text-white md:h-8 md:w-fit md:gap-1.5 md:space-x-0.5 md:pe-2.5 md:ps-2"
        onClick={toggle}
      >
        <Iconx name="plus-sign" className="size-3.5" />
        <span
          className={cn(
            "hidden font-inter text-sm font-medium capitalize tracking-tighter md:flex",
            contentHeight, // temp
          )}
        >
          create event
        </span>
      </button>
      <SideVaul
        open={open}
        onOpenChange={toggle}
        direction="right"
        title={"Create"}
        description={"Description"}
        dismissible
      >
        <FlatWindow
          variant="god"
          closeFn={toggle}
          icon="sparkles"
          title="Create New Event"
          className="w-full border-0 border-macd-gray bg-void text-chalk"
          wrapperStyle="border-macd-gray h-full border-[0.33px]"
        >
          <FormContainer>
            <div ref={ref} className="flex h-2/5 w-full items-center">
              <TicketStack
                day={event_day}
                date={narrow.date}
                site={eventSite}
                title={eventName}
                tickets={ticketCount}
                time={event_time.compact}
              />
            </div>
            <div className="flex h-fit w-full overflow-auto md:pb-0">
              <Form
                action={action}
                className="h-full w-full space-y-2 bg-white p-4 md:space-y-3"
              >
                <div className="w-full md:px-2">
                  <Input
                    required
                    size="lg"
                    id="event_name"
                    name="event_name"
                    label="Event name"
                    onChange={handleChange}
                    classNames={inputClassNames}
                    defaultValue={initialState.event_name}
                    placeholder="What should we call your event?"
                  />
                </div>

                <OptionCtxProvider>
                  <OptionFields
                    render={renderOptions}
                    data={option_value_data}
                  />
                </OptionCtxProvider>

                <div className="w-full md:px-2">
                  <EventSite />
                </div>
                <div className="hidden w-full space-y-2 px-2">
                  <Textarea
                    name="event_desc"
                    label="Description"
                    ref={descRef}
                    defaultValue={state.event_desc}
                    classNames={{
                      inputWrapper:
                        "border-[0.33px] border-macd-gray shadow-none",
                      label: "font-medium md:font-semibold",
                    }}
                  />
                </div>
                <div className="flex w-full items-center justify-between tracking-tight">
                  <div className="flex space-x-4"></div>
                  <Button
                    isLoading={pending}
                    color="primary"
                    variant="solid"
                    type="submit"
                  >
                    Next <span className="ps-2">&rarr;</span>
                  </Button>
                </div>
              </Form>
            </div>
          </FormContainer>
        </FlatWindow>
      </SideVaul>
    </div>
  );
};

const FormContainer = ({ children }: { children: ReactNode }) => (
  <div className={cn("mx-auto h-fit w-screen md:w-[30rem]")}>
    <div className="h-[calc(100vh-100px)] space-y-4 overflow-y-scroll pb-24">
      {children}
    </div>
  </div>
);

interface OptionFieldsProps {
  children?: ReactNode;
  render: (option: OptionKey | null) => ReactNode;
  data: (string | number | boolean | undefined)[];
}

const OptionFields = ({ children, render, data }: OptionFieldsProps) => {
  const { selectedOption } = use(OptionCtx)!;
  const { start_time, end_time } = useMoment({
    start: data[3] as number,
    end: data[4] as number,
  });

  const options_data: OptionButtonProps[] = useMemo(
    () => [
      {
        label: "Tickets",
        value: data[0],
        name: "ticket_count",
      },
      {
        label: "Event Type",
        value: data[1],
        name: "event_type",
      },
      {
        label: "Category",
        value: data[2],
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
        {options_data.slice(0, 3).map((option) => (
          <OptionButton
            key={option.name}
            label={option.label}
            value={option.value}
            name={option.name}
          />
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-3 md:px-2">
        {options_data.slice(3).map((option) => (
          <OptionButton
            key={option.name}
            label={option.label}
            value={option.value}
            name={option.name}
          />
        ))}
      </div>
      <OptionActionSheet>
        {render(selectedOption)}
        {children}
      </OptionActionSheet>
    </div>
  );
};
