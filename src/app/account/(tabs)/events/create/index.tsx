"use client";

import { useDime } from "@/hooks/useDime";
import { useMoment } from "@/hooks/useMoment";
import { useToggle } from "@/hooks/useToggle";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { TicketStack } from "@/ui/card/ticket";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { opts } from "@/utils/helpers";
import { Button, Form, Input, Switch, Textarea } from "@nextui-org/react";
import type { InsertEvent } from "convex/events/d";
import {
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  use,
  useActionState,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEvent } from "../../../useEvent";
import {
  OptionActionSheet,
  OptionButton,
  type OptionButtonProps,
} from "./components";
import { OptionCtx, OptionCtxProvider, type OptionKey } from "./ctx";

export const CreateEvent = () => {
  const { open, toggle } = useToggle();
  const [eventName, setEventName] = useState("");
  const [ticketCount, setTicketCount] = useState(50);
  const [ticketLimit, setTicketLimit] = useState(50);
  const [eventType] = useState("");
  const [eventStartDate] = useState(0);
  const [eventEndDate] = useState(0);
  const [eventSite, setEventSite] = useState("");
  const [eventDate] = useState("");
  const [eventDay] = useState("");
  const [eventDuration] = useState(0);

  const [dateRange] = useState<{ start: number; end: number }>({
    start: Date.now(),
    end: Date.now() + 360000,
  });

  const { event_time } = useMoment({
    start: eventStartDate,
    end: eventEndDate,
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  }, []);

  const handleChangeSite = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEventSite(e.target.value);
  }, []);

  const descRef = useRef<HTMLTextAreaElement | null>(null);

  // const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   switch (e.target.name) {
  //     case "ticket_count":
  //       return setTicketCount(+e.target.value);
  //     case "event_type":
  //       return setEventType(e.target.value);
  //     default:
  //       return;
  //   }
  // };

  // const handleDateChange = (value: RangeValue<DateValue> | null) => {
  //   const dateStr = {
  //     start: value?.start ?? parseAbsoluteToLocal(new Date().toISOString()),
  //     end: value?.end ?? parseAbsoluteToLocal(new Date().toISOString()),
  //   };
  //   setDateRange(dateStr);
  //   const startDate = dateStr.start.toDate("GMT");
  //   setEventStartDate(startDate.getTime());
  //   const endDate = dateStr.end.toDate("GMT");
  //   setEventEndDate(endDate.getTime());
  //   setEventDuration(endDate.getTime() - startDate.getTime());

  //   const compact = moment(dateStr.start).format("LL");
  //   const day = moment(dateStr.start).format("dddd");
  //   setEventDate(compact);
  //   setEventDay(day);
  // };

  const { createEvent } = useEvent();

  const initialState: InsertEvent = {
    event_id: "",
    event_desc: "",
    event_name: "",
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
      event_desc: fd.get("event_desc") as string,
      event_type: fd.get("event_type") as string,
      event_geo: (fd.get("event_geo") as string) ?? undefined,
      event_url: (fd.get("event_url") as string) ?? undefined,
    };

    await createEvent({
      ...data,
      start_date: eventStartDate,
      end_date: eventEndDate,
      duration: eventDuration,
      ticket_count: ticketCount,
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
        label="Name of venue"
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

  const option_value_data = useMemo(
    () => [ticketCount, "online", "category", Date.now(), Date.now() + 3600000],
    [ticketCount],
  );

  const handleChangeTicketCount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTicketLimit(+e.target.value);
    },
    [],
  );
  const handleChangeTicketLimit = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTicketCount(+e.target.value);
    },
    [],
  );
  const handleSelectTicketCount = useCallback(
    (value: string) => (e: MouseEvent) => {
      e.preventDefault();
      setTicketCount(+value);
    },
    [],
  );

  const isCustomTicketCount = useToggle();
  const isCustomTicketLimit = useToggle();

  const renderOptions = useCallback(
    (option: OptionKey | null) => {
      switch (option) {
        case "ticket_count":
          return (
            <div className="">
              <p className="font-inter tracking-tight text-macl-gray">
                What&apos;s your estimated ticket count
              </p>
              <div className="grid w-full grid-cols-3 gap-1 py-8">
                {option_data?.[0]?.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={handleSelectTicketCount(item.key)}
                    className="relative flex h-14 items-center justify-center rounded-md bg-primary text-white"
                  >
                    {item.key}
                    <Icon
                      name="Check"
                      className={cn(
                        "absolute right-3 top-3 hidden text-secondary",
                        { flex: ticketCount === +item.key },
                      )}
                    />
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex w-full items-center justify-between gap-10">
                  <Input
                    size="lg"
                    id="ticket_count"
                    name="ticket_count"
                    label="Custom Ticket Count"
                    placeholder="Custom ticket count"
                    disabled={!isCustomTicketCount.open}
                    defaultValue={String(ticketCount)}
                    // defaultValue={String(ticketCount)}
                    onChange={handleChangeTicketCount}
                    endContent={
                      <Switch
                        classNames={{
                          base: "bg-gray-200 rounded-full",
                        }}
                        checked={isCustomTicketCount.open}
                        onChange={isCustomTicketCount.toggle}
                      />
                    }
                    classNames={{
                      ...inputClassNames,
                      input:
                        "disabled:opacity-50 disabled:cursor-not-allowed font-bold",
                    }}
                  />
                </div>
                <Input
                  size="lg"
                  id="ticket_limit"
                  name="ticket_limit"
                  label="Ticket Count Limit"
                  placeholder="Ticket count limit"
                  defaultValue={String(ticketLimit)}
                  onChange={handleChangeTicketLimit}
                  disabled={!isCustomTicketLimit.open}
                  endContent={
                    <Switch
                      classNames={{
                        base: "bg-gray-200 rounded-full",
                      }}
                      checked={isCustomTicketLimit.open}
                      onChange={isCustomTicketLimit.toggle}
                    />
                  }
                  classNames={{
                    ...inputClassNames,
                    input:
                      "disabled:opacity-50 disabled:cursor-not-allowed font-bold",
                  }}
                />
              </div>
            </div>
          );
        default:
          return <div className="bg-gray-200 p-2">{option}</div>;
      }
    },
    [
      ticketCount,
      ticketLimit,
      handleSelectTicketCount,
      handleChangeTicketCount,
      handleChangeTicketLimit,
      isCustomTicketCount,
      isCustomTicketLimit,
    ],
  );

  return (
    <div className="flex h-10 w-full items-center justify-end font-inter xl:space-x-1">
      <button
        className="group/create flex size-6 items-center justify-center rounded-lg bg-secondary px-0 text-white md:h-8 md:w-fit md:gap-1.5 md:space-x-0.5 md:pe-2.5 md:ps-2"
        onClick={toggle}
      >
        <Icon name="Plus" className="size-3.5" />
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
          icon="Sparkles2"
          title="Create New Event"
          className="w-full border-0 border-macd-gray bg-void text-chalk"
          wrapperStyle="border-macd-gray border-[0.33px]"
        >
          <FormContainer>
            <div ref={ref} className="flex h-2/5 w-full items-center">
              <TicketStack
                day={eventDay}
                date={eventDate}
                site={eventSite}
                title={eventName}
                tickets={ticketCount}
                time={event_time.compact}
              />
            </div>
            <div className="flex h-3/5 w-full overflow-scroll md:pb-0">
              <Form
                action={action}
                className="w-full space-y-2 bg-white p-4 md:space-y-3"
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
                    start={dateRange.start}
                    end={dateRange.end}
                    render={renderOptions}
                    data={option_value_data}
                  >
                    <div></div>
                  </OptionFields>
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
                <div className="flex h-1/5 w-full items-center justify-between tracking-tight">
                  <div className="flex space-x-4"></div>
                  <Button disabled isLoading={pending} type="submit">
                    {/* Next <span className="ps-2">&rarr;</span> */}
                    <Icon name="SpinnerBall" />
                    Dev Mode
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
  <div className={cn("mx-auto h-[calc(100vh-64px)] w-screen md:w-[30rem]")}>
    {children}
  </div>
);

interface OptionFieldsProps {
  children: ReactNode;
  start: number;
  end: number;
  render: (option: OptionKey | null) => ReactNode;
  data: (string | number | boolean | undefined)[];
}

const OptionFields = ({
  children,
  start,
  end,
  render,
  data,
}: OptionFieldsProps) => {
  const { selectedOption } = use(OptionCtx)!;

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
        value: data[3],
        name: "start_date",
      },
      {
        label: "End Time",
        value: data[4],
        name: "end_date",
      },
    ],
    [data],
  );

  return (
    <div className="space-y-4">
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
        <OptionButton
          label="Start time"
          value={new Date(start).toISOString()}
          name="start_date"
        />
        <OptionButton
          label="End time"
          value={new Date(end).toISOString()}
          name="end_date"
        />
      </div>
      <OptionActionSheet>
        {render(selectedOption)}
        {children}
      </OptionActionSheet>
    </div>
  );
};

interface EventSelectData {
  id: string;
  label: string;
  items: Array<{ key: string; label: string; subtext?: string }>;
  placeholder?: string;
}
const option_data: EventSelectData[] = [
  {
    id: "ticket_count",
    label: "Tickets",
    items: [
      {
        key: "50",
        label: "50",
      },
      {
        key: "100",
        label: "50-100",
      },
      {
        key: "500",
        label: "100-500",
      },
      {
        key: "1000",
        label: "500-1000",
      },
      {
        key: "2000",
        label: "1000-2000",
      },
    ],
  },
  {
    id: "event_type",
    label: "Type",
    items: [
      {
        key: "online",
        label: "Online",
      },
      {
        key: "onsite",
        label: "Onsite",
      },
    ],
  },
  {
    id: "category",
    label: "category",
    items: [
      {
        key: "live",
        label: "Concerts & Music Festivals",
        subtext: "live music performance",
      },
      {
        key: "sports",
        label: "Sports Events",
      },
      {
        key: "theater",
        label: "Theater & Performing Arts",
        subtext: "theater arts",
      },
      {
        key: "seminar",
        label: "Conferences & Seminars",
        subtext: "training seminar",
      },
      {
        key: "exhibition",
        label: "Exhibitions & Trade Shows",
        subtext: "trade shows",
      },
      {
        key: "cultural",
        label: "Festivals & Cultural Events",
        subtext: "cultural events",
      },
      {
        key: "party",
        label: "Nightlife & Parties",
        subtext: "parties",
      },
      {
        key: "egames",
        label: "Gaming & eSports",
        subtext: "egames",
      },
      {
        key: "online",
        label: "Online & Virtual Events",
        subtext: "online",
      },
      {
        key: "hackaton",
        label: "Hackaton",
        subtext: "hackaton",
      },
      {
        key: "rocket",
        label: "Rocket Launch",
        subtext: "rocket launch",
      },
    ],
  },
];

const inputClassNames = {
  inputWrapper: "border-[0.33px] border-macd-gray shadow-none",
  label: "pb-1 opacity-60 text-sm tracking-tight",
  input:
    "font-bold tracking-tight placeholder:font-semibold focus:placeholder:opacity-50 placeholder:text-primary font-inter placeholder:text-sm",
};

/*
<div className="grid w-full grid-cols-8 gap-3 md:px-2">
                  {select_data.map((data) => (
                    <Select
                      id={data.id}
                      name={data.id}
                      key={data.id}
                      label={data.label}
                      onChange={handleSelectChange}
                      size="md"
                      className={cn(
                        "w-full",
                        data.id === "event_type" ? "col-span-2" : "col-span-3",
                      )}
                      classNames={{
                        popoverContent:
                          "py-0.5 px-0 scroll h-fit pointer-events-auto overflow-y-scroll",
                        trigger:
                          "font-medium shadow-none border-[0.33px] border-macd-gray rounded-xl",
                        label: "text-xs md:text-sm font-medium capitalize",
                      }}
                      selectorIcon={
                        <Icon name="ArrowVertical" className="-pr-2" />
                      }
                      items={data.items}
                      variant="flat"
                      renderValue={(items) =>
                        items.map((item) => (
                          <div
                            key={item.data?.key}
                            className="text-xs font-medium"
                          >
                            {item.data?.label}
                          </div>
                        ))
                      }
                    >
                      {(item) => (
                        <SelectItem
                          className="w-full whitespace-nowrap ps-1"
                          key={item.key}
                          textValue={item.label}
                          selectedIcon={(item) => (
                            <Icon
                              name="Check"
                              className={cn("hidden size-3 text-teal-600", {
                                flex: item.isSelected,
                              })}
                            />
                          )}
                        >
                          {item.label}
                        </SelectItem>
                      )}
                    </Select>
                  ))}
                  <DateRangePicker
                    hideTimeZone
                    visibleMonths={1}
                    className="col-span-8 overflow-hidden"
                    label="Event Duration"
                    defaultValue={{
                      ...dateRange,
                    }}
                    onChange={handleDateChange}
                    popoverProps={{
                      placement: "top",
                    }}
                    color="primary"
                    classNames={{
                      bottomContent: "hidden",
                      innerWrapper: "tracking-tighter sm:tracking-normal",
                      inputWrapper: "shadow-none bg-white",
                      base: [
                        "font-medium w-full border-[0.33px] rounded-2xl border-macd-gray",
                        "tracking-tight shadow-none",
                      ],
                      popoverContent:
                        "w-full py-5 pointer-events-auto rounded-3xl dark",
                      calendarContent: "bg-gray-700/40 rounded-t-lg",
                    }}
                    granularity="minute"
                  />
                </div>
*/
