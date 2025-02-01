import { useScreen } from "@/hooks/useScreen";
import { useToggle } from "@/hooks/useToggle";
import { Icon, type IconName } from "@/icons";
import { cn } from "@/lib/utils";
import { TicketStack } from "@/ui/card/ticket";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { opts } from "@/utils/helpers";
import { parseAbsolute, parseAbsoluteToLocal } from "@internationalized/date";
import {
  Button,
  DateRangePicker,
  type DateValue,
  Form,
  Input,
  type RangeValue,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import moment from "moment";
import {
  type ChangeEvent,
  type ReactNode,
  useActionState,
  useCallback,
  useRef,
  useState,
} from "react";
import { type PrimaryCreateEvent, useEvent } from "./useEvent";

interface CreateNewEventProps {
  pathname: string;
  account_id: string | undefined;
}
export const CreateNewEvent = ({
  pathname,
  account_id,
}: CreateNewEventProps) => {
  const { isDesktop } = useScreen();
  const { open, toggle } = useToggle();
  const [eventName, setEventName] = useState("");
  const [ticketCount, setTicketCount] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventTime] = useState("");
  const [eventSite, setEventSite] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDay, setEventDay] = useState("");

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  }, []);

  const handleChangeSite = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEventSite(e.target.value);
  }, []);

  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.name) {
      case "ticket_count":
        return setTicketCount(e.target.value);
      case "event_type":
        return setEventType(e.target.value);
      default:
        return;
    }
  };

  const handleDateChange = (value: RangeValue<DateValue> | null) => {
    // const short = value?.toDate("GMT").toLocaleDateString(); // mm/dd/yyyy
    const dateString = value?.start.toDate("GMT");
    const compact = moment(dateString).format("LL");
    const day = moment(dateString).format("dddd");
    setEventDate(compact);
    setEventDay(day);
  };

  // const handleTimeChange = (value: TimeInputValue | null) => {
  //   const time = moment(value).format("LT");
  //   setEventTime(time);
  // };

  const { createEvent } = useEvent();

  const initialState: PrimaryCreateEvent = {
    event_desc: "",
    event_name: "",
    event_date: "",
    event_type: "",
    event_time: "",
    event_geo: "",
    event_url: "",
    ticket_count: "",
  };
  const fn = async (initialState: PrimaryCreateEvent, fd: FormData) => {
    const data: PrimaryCreateEvent = {
      event_name: fd.get("event_name") as string,
      event_desc: fd.get("event_desc") as string,
      event_date: fd.get("event_date") as string,
      event_type: fd.get("event_type") as string,
      event_time: fd.get("event_time") as string,
      event_geo: (fd.get("event_geo") as string) ?? undefined,
      event_url: (fd.get("event_url") as string) ?? undefined,
      ticket_count: fd.get("ticket_count") as string,
    };
    await createEvent(data);
    return data;
  };

  const [state, action, pending] = useActionState(fn, initialState);

  const EventSite = useCallback(() => {
    const options = opts(
      <Input
        id="event_geo"
        name="event_geo"
        label="Venue"
        onChange={handleChangeSite}
        // defaultValue={eventSite}
        required
        classNames={{
          inputWrapper: "border-[0.33px] border-macd-gray shadow-none",
          label: "font-semibold",
        }}
      />,
      <Input
        id="event_url"
        name="event_url"
        label="URL"
        onChange={handleChangeSite}
        // defaultValue={eventSite}
        required
        classNames={{
          inputWrapper: "border-[0.33px] border-macd-gray shadow-none",
          label: "font-semibold",
        }}
      />,
    );
    return <>{options.get(eventType === "onsite")}</>;
  }, [eventType, handleChangeSite]);

  return (
    <div className="flex h-10 w-full items-center justify-end font-inter xl:space-x-1">
      <Button
        href={`${pathname}/edit?page=${account_id}`}
        size={isDesktop ? "sm" : "sm"}
        className="group/create bg-teal-500 px-2 text-chalk lg:flex"
        variant="solid"
        onPress={toggle}
      >
        <Icon
          name="Sparkles2"
          className="size-3 stroke-0 group-hover/create:text-white md:size-4"
        />
        <span className="text-xs font-normal tracking-tighter drop-shadow-sm group-hover/create:text-white md:text-sm md:font-medium">
          Create an event
        </span>
      </Button>
      <SideVaul
        open={open}
        onOpenChange={toggle}
        direction="right"
        title={"Create"}
        description={"Description"}
      >
        <FlatWindow
          closeFn={toggle}
          icon="Sparkles2"
          title="Create New Event"
          className="border-macd-gray bg-chalk"
          variant="adam"
        >
          <FormContainer>
            <div className="flex h-2/5 w-full items-center">
              <TicketStack
                title={eventName}
                date={eventDate}
                time={eventTime}
                site={eventSite}
                day={eventDay}
                tickets={ticketCount}
              />
            </div>
            <div className="flex h-3/5 w-full overflow-scroll md:pb-0">
              <Form
                action={action}
                className="w-full space-y-2 rounded-lg border-[0.0px] border-macd-gray bg-white p-4 md:space-y-3"
              >
                <div className="grid w-full grid-cols-2 gap-4 md:px-2">
                  {select_data.map((data) => (
                    <Select
                      id={data.id}
                      name={data.id}
                      key={data.id}
                      label={data.label}
                      onChange={handleSelectChange}
                      size={isDesktop ? "md" : "md"}
                      className="w-full"
                      classNames={{
                        popoverContent: "pointer-events-auto",
                        trigger:
                          "font-medium shadow-none border-[0.33px] border-macd-gray rounded-xl",
                        label: "text-xs md:text-sm font-medium capitalize",
                      }}
                      items={data.items}
                      variant="flat"
                    >
                      {(item) => (
                        <SelectItem
                          className="w-full"
                          key={item.key}
                          textValue={item.label}
                        >
                          {item.label}
                        </SelectItem>
                      )}
                    </Select>
                  ))}
                  <DateRangePicker
                    hideTimeZone
                    visibleMonths={1}
                    className="col-span-2"
                    label="Event Duration"
                    onChange={handleDateChange}
                    popoverProps={{
                      placement: "top",
                    }}
                    defaultValue={{
                      start: parseAbsoluteToLocal(new Date().toISOString()),
                      end: parseAbsolute(new Date().toISOString(), "GMT"),
                    }}
                    classNames={{
                      inputWrapper: "shadow-none",
                      base: [
                        "font-medium w-full border-[0.33px] rounded-xl border-macd-gray",
                        "tracking-tight shadow-none",
                      ],
                      popoverContent: "pointer-events-auto dark",
                      segment:
                        "cursor-pointer focus:bg-macl-mint/20 hover:bg-gray-200",
                    }}
                  />
                  {/* <DatePicker
                    label={"Event Date"}
                    id="event_date"
                    name="event_date"
                    onChange={handleDateChange}
                    size={isDesktop ? "md" : "sm"}
                    className="shadow-none"
                    classNames={{
                      inputWrapper: "shadow-none",
                      base: [
                        "font-medium w-full border-[0.33px] rounded-xl border-macd-gray",
                        "tracking-tight shadow-none",
                      ],
                      popoverContent: "pointer-events-auto",
                      segment:
                        "cursor-pointer focus:bg-macl-mint/20 hover:bg-gray-200",
                    }}
                  /> */}
                  {/* <TimeInput
                    label="Event Time"
                    id="event_time"
                    name="event_time"
                    size={isDesktop ? "md" : "sm"}
                    onChange={handleTimeChange}
                    classNames={{
                      inputWrapper: "shadow-none",
                      base: [
                        "font-medium border-[0.33px] rounded-xl border-macd-gray",
                      ],
                      segment:
                        "cursor-pointer focus:bg-macl-mint/20 hover:bg-gray-200",
                    }}
                  /> */}
                </div>
                <div className="w-full md:px-2">
                  <Input
                    id="event_name"
                    name="event_name"
                    label="Event Name"
                    onChange={handleChange}
                    defaultValue={state.event_name}
                    placeholder=""
                    required
                    classNames={{
                      inputWrapper:
                        "border-[0.33px] border-macd-gray shadow-none",
                      label: "font-semibold",
                    }}
                  />
                </div>
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
                <div className="flex h-1/5 w-full items-center justify-between border tracking-tight">
                  <div className="flex space-x-4"></div>
                  <Button isLoading={pending} type="submit" color="primary">
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
  <div
    className={cn(
      "h-[76vh] w-[calc(94vw)]",
      "sm:h-[80vh] sm:w-[calc(64vw)] sm:bg-army",
      "md:h-[calc(80vh)] md:w-[calc(54vw)] md:bg-tan",
      "lg:w-[calc(44vw)] lg:bg-peach",
      "xl:w-[calc(48vw)]",
    )}
  >
    {children}
  </div>
);

interface EventSelectData {
  id: string;
  label: string;
  items: Array<{ key: string; label: string }>;
  placeholder: string;
  icon: IconName;
}
const select_data: EventSelectData[] = [
  {
    id: "ticket_count",
    label: "Tickets",
    items: [
      {
        key: "50",
        label: "0-50",
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
    placeholder: "",
    icon: "TicketFill",
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
        label: "On-site",
      },
    ],
    placeholder: "",
    icon: "Bell",
  },
  // {
  //   id: "audience",
  //   label: "Age Restriction",
  //   items: [
  //     {
  //       key: "kids",
  //       label: "Kids - 6 and up",
  //     },
  //     {
  //       key: "teen",
  //       label: "Teens - 13 and above",
  //     },
  //     {
  //       key: "adult",
  //       label: "Adult - 18 and above",
  //     },
  //   ],
  //   placeholder: "",
  //   icon: "Bell",
  // },
];

{
  /* <section className="flex items-center gap-2">
                  {["tag"]?.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-full bg-shade/60 px-3 py-1 text-xs hover:bg-gray-100"
                    >
                      {tag}
                    </div>
                  ))}
                </section> */
}
