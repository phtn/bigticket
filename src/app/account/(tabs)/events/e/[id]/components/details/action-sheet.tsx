import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { BottomVaul } from "@/ui/vaul";
import { log } from "@/utils/logger";
import {
  CalendarDate,
  CalendarDateTime,
  fromDate,
  type ZonedDateTime,
} from "@internationalized/date";
import {
  DatePicker,
  Input,
  RadioGroup,
  type RadioProps,
  Switch,
  TimeInput,
  type TimeInputValue,
  useRadio,
  VisuallyHidden,
} from "@nextui-org/react";
import {
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  category_options,
  event_type_options,
  ticket_count_options,
} from "../../../../create/static";
import { EventDetailCtx, type EventDetailKey } from "./ctx";
import { type EventField } from "./schema";
import { Iconx } from "@/icons";

export interface EventDetailButtonProps extends EventField {
  name: EventDetailKey;
}
export const EventDetailOption = ({
  name,
  label,
  value,
}: EventDetailButtonProps) => {
  const { toggle, setSelectedEventDetail } = use(EventDetailCtx)!;
  const handleClick = useCallback(
    (name: EventDetailKey) => (e: MouseEvent) => {
      log("check", name);
      e.preventDefault();
      setSelectedEventDetail(name);
      toggle();
    },
    [toggle, setSelectedEventDetail],
  );
  return (
    <button
      id={name}
      name={name}
      onClick={handleClick(name)}
      className="h-16 w-full space-y-1 rounded-xl bg-white py-1 ps-4 text-left font-inter tracking-tight hover:bg-cake"
    >
      <p className="text-xs font-medium leading-5 text-primary/60">{label}</p>
      <p className="overflow-hidden whitespace-nowrap text-sm font-semibold capitalize leading-5">
        {value}
      </p>
    </button>
  );
};

export const EventDetailActionSheet = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { open, toggle, selectedEventDetail } = use(EventDetailCtx)!;
  const options: Record<string, { title: string; description?: string }> = {
    ticket_count: {
      title: "How many tickets for this event?",
      description:
        "Select or enter a custom the number of tickets you plan to sell.",
    },
    event_type: {
      title: "Type of Event",
      description: "Select the type of event you want to create.",
    },
    category: {
      title: "Event Category",
      description: "Select the category of your event.",
    },
    subcategory: {
      title: "Event Subcategory",
      description: "Select the subcategory of your event.",
    },
    start_date: {
      title: "Event Start date & time",
      description: "Select the start date and time of your event.",
    },
    end_date: {
      title: "End date & time",
      description: "Select the end date and time of your event.",
    },
    is_private: {
      title: "Audience Access",
      description: "Select the audience access type your event.",
    },
  };

  return (
    <BottomVaul open={open} onOpenChange={toggle} dismissible>
      <div
        className={cn("h-fit w-screen overflow-y-scroll p-6 md:w-[30rem]", {
          "relative max-h-[32rem] pb-14":
            selectedEventDetail === "category" ||
            selectedEventDetail === "subcategory",
        })}
      >
        <h2 className="font-inter text-xl font-bold tracking-tighter">
          {selectedEventDetail ? options?.[selectedEventDetail]?.title : ""}
        </h2>
        <p className="font-inter text-sm tracking-tight text-macl-gray">
          {selectedEventDetail
            ? options?.[selectedEventDetail]?.description
            : ""}
        </p>
        {children}
        <div
          className={cn("flex h-24 w-full items-end", {
            "fixed bottom-0 left-0 items-center border bg-white px-6":
              selectedEventDetail === "category" || "subcategory",
          })}
        >
          <button
            onClick={toggle}
            className="my-4 flex h-12 w-full items-center justify-center rounded-lg bg-primary font-inter text-sm font-semibold tracking-tighter text-white"
          >
            Save changes
          </button>
        </div>
      </div>
    </BottomVaul>
  );
};

interface TicketCountProps {
  ticketCount: number;
  handleSelectTicketCount: (value: number) => (e: MouseEvent) => void;
  handleCustomTicketCount: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TicketCount = ({
  ticketCount,
  handleSelectTicketCount,
  handleCustomTicketCount,
}: TicketCountProps) => {
  const isCustomTicketCount = useToggle();

  return (
    <div>
      <div className="grid w-full grid-cols-3 gap-1 py-8">
        {ticket_count_options.items.map((item) => (
          <button
            key={item.key}
            onClick={handleSelectTicketCount(+item.value)}
            className="relative flex h-14 items-center justify-center rounded-md bg-primary text-white"
          >
            {item.value}
            <Iconx
              name="check"
              className={cn(
                "absolute right-3 top-3 hidden animate-enter text-secondary",
                { flex: ticketCount === +item.value },
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
            onChange={handleCustomTicketCount}
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
      </div>
    </div>
  );
};

interface EventTypeProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

export const EventType = ({ value, onChange }: EventTypeProps) => {
  return (
    <div className="py-8">
      <RadioGroup onValueChange={onChange} defaultValue={value}>
        {event_type_options.items.map((item) => (
          <CustomRadio
            key={item.key}
            value={String(item.value)}
            description={item.description}
            classNames={{
              base: "space-y-4",
              label: "font-semibold font-inter tracking-tight",
              description: "text-sm opacity-60 font-inter tracking-tight",
            }}
          >
            {item.label}
          </CustomRadio>
        ))}
      </RadioGroup>
    </div>
  );
};

export const EventCategory = ({ value, onChange }: EventTypeProps) => {
  return (
    <div className="py-8">
      <RadioGroup onValueChange={onChange} defaultValue={value}>
        {category_options.items.map((item) => (
          <CustomRadio
            key={item.key}
            value={String(item.value)}
            description={item.description}
            classNames={{
              base: "space-y-4",
              label: "font-semibold font-inter tracking-tight",
              description: "text-sm opacity-60 font-inter tracking-tight",
            }}
          >
            {item.label}
          </CustomRadio>
        ))}
      </RadioGroup>
    </div>
  );
};

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex flex-row-reverse items-center justify-between tap-highlight-transparent",
        "cursor-pointer gap-4 rounded-xl border-2 border-default p-4",
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};
interface EventDateProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}
type TimeValue = {
  hour?: number;
  minute?: number;
  timeZone?: string;
  offset?: number;
};
type DateValue = {
  year?: number;
  month?: number;
  day?: number;
  era?: string;
};
type DateTimeValue = DateValue & TimeValue;
export const EventDate = ({ value, onChange, label }: EventDateProps) => {
  const today = useMemo(() => new Date(value), [value]);
  const [timeValue, setTimeValue] = useState<ZonedDateTime>(
    fromDate(new Date(value) ?? today, "Asia/Manila"),
  );
  const [dateValue, setDateValue] = useState<CalendarDate>(
    new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    ),
  );
  const [dt, setDateTimeValue] = useState<DateTimeValue | null>(null);

  const handleDateChange = useCallback(
    (v: DateValue | null) => {
      setTimeValue(fromDate(new Date(), "Asia/Manila"));
      setDateValue(
        new CalendarDate(
          v?.year ?? today.getFullYear(),
          v?.month ?? today.getMonth() + 1,
          v?.day ?? today.getDate(),
        ),
      );
      setDateTimeValue((prev) => ({
        ...prev,
        year: v?.year ?? today.getFullYear(),
        month: v?.month,
        day: v?.day,
        era: v?.era,
      }));
    },
    [today],
  );

  const handleTimeChange = useCallback((v: TimeInputValue | null) => {
    setDateTimeValue(() => ({
      hour: v?.hour,
      minute: v?.minute,
    }));
  }, []);

  useEffect(() => {
    if (!dt) return;
    onChange(
      new CalendarDateTime(
        dt.year ?? dateValue.year,
        dt.month ?? dateValue.month,
        dt.day ?? dateValue.day,
        dt.hour ?? timeValue.hour,
        dt.minute ?? timeValue.minute,
      )
        .toDate("Asia/Manila")
        .getTime(),
    );
  }, [dt, dateValue, timeValue, onChange]);

  return (
    <div className="space-y-4 py-6">
      <DatePicker
        popoverProps={{
          placement: "top",
        }}
        isDateUnavailable={(date) =>
          new Date(date.toDate("Asia/Manila")).getTime() + 82800000 < Date.now()
        }
        radius="none"
        label={label + " Date"}
        onChange={handleDateChange}
        defaultValue={dateValue}
        classNames={{
          innerWrapper: "",
          label: "h-10 opacity-60 tracking-tight py-2",
          inputWrapper: "shadow-none bg-white",
          base: "space-y-2 flex items-center bg-white border border-macd-gray rounded-xl",
          input: "text-lg",
          popoverContent: "w-full pointer-events-auto rounded-3xl dark",
          calendarContent: "bg-gray-700/40 rounded-t-lg",
        }}
      />
      <TimeInput
        hideTimeZone
        defaultValue={timeValue}
        label={label + " Time"}
        onChange={handleTimeChange}
        classNames={{
          label: "tracking-tight py-2",
          base: "border h-20 flex items-center overflow-hidden border-macd-gray bg-white rounded-xl",
          innerWrapper: "rounded-none",
          input: "text-lg",
          inputWrapper: "shadow-none rounded-none",
          segment: "text-lg active:bg-secondary/40 font-semibold px-1.5",
        }}
      />
    </div>
  );
};

export const inputClassNames = {
  inputWrapper: "border-[0.33px] border-macd-gray shadow-none",
  label: "pb-1 opacity-60 text-sm tracking-tight",
  input:
    "font-bold tracking-tight placeholder:font-semibold focus:placeholder:opacity-50 placeholder:text-primary font-inter placeholder:text-sm",
};

export const ensureValidEndTime = (
  startTime: number,
  endTime: number,
): number => {
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

  while (endTime < startTime) {
    endTime += oneHour; // Add 1 hour
  }

  return endTime + 3600000; // Return the corrected end time
};
