import { BottomVaul } from "@/ui/vaul";
import {
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  use,
  useCallback,
} from "react";
import { OptionCtx, type OptionKey } from "./ctx";
import {
  category_options,
  event_type_options,
  ticket_count_options,
} from "./static";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import {
  Input,
  RadioGroup,
  type RadioProps,
  Switch,
  useRadio,
  VisuallyHidden,
} from "@nextui-org/react";
import { useToggle } from "@/hooks/useToggle";

export interface OptionButtonProps {
  name: OptionKey;
  label: string;
  placeholder?: string;
  value: string | number | boolean | undefined;
}
export const OptionButton = ({ name, label, value }: OptionButtonProps) => {
  const { toggle, setSelectedOption } = use(OptionCtx)!;
  const handleClick = useCallback(
    (name: OptionKey | null) => (e: MouseEvent) => {
      e.preventDefault();
      setSelectedOption(name);
      toggle();
    },
    [toggle, setSelectedOption],
  );
  return (
    <button
      id={name}
      name={name}
      onClick={handleClick(name)}
      className="h-14 w-full space-y-2 rounded-xl border border-macl-gray/60 py-2 ps-2.5 text-left font-inter tracking-tight hover:bg-macl-gray/5"
    >
      <p className="text-xs font-medium leading-none text-macl-gray">{label}</p>
      <p className="overflow-hidden whitespace-nowrap font-semibold capitalize leading-none">
        {value}
      </p>
    </button>
  );
};

export const OptionActionSheet = ({ children }: { children: ReactNode }) => {
  const { open, toggle, selectedOption } = use(OptionCtx)!;
  const options: Record<OptionKey, string> = {
    ticket_count: "Number of Tickets",
    event_type: "Type of Event",
    category: "Event Category",
    start_date: "Start Date & Time",
    end_date: "End Date & Time",
  };

  return (
    <BottomVaul dismissible open={open} onOpenChange={toggle}>
      <div className="h-fit max-h-96 w-screen overflow-y-scroll p-6 md:w-[30rem]">
        <h2 className="font-inter text-lg font-bold tracking-tighter">
          {selectedOption ? options[selectedOption] : ""}
        </h2>
        {children}
        <button
          onClick={toggle}
          className="my-4 flex h-12 w-full items-center justify-center rounded-lg bg-primary font-inter font-semibold tracking-tighter text-white"
        >
          Save changes
        </button>
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
      <p className="font-inter text-sm tracking-tight text-macl-gray">
        What&apos;s your estimated ticket count
      </p>
      <div className="grid w-full grid-cols-3 gap-1 py-8">
        {ticket_count_options.items.map((item) => (
          <button
            key={item.key}
            onClick={handleSelectTicketCount(+item.value)}
            className="relative flex h-14 items-center justify-center rounded-md bg-primary text-white"
          >
            {item.value}
            <Icon
              name="Check"
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
  value: string;
  onChange: (value: string) => void;
}

export const EventType = ({ value, onChange }: EventTypeProps) => {
  return (
    <div>
      <p className="font-inter text-sm tracking-tight text-macl-gray">
        What type of event are you hosting?
      </p>
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
    </div>
  );
};

export const EventCategory = ({ value, onChange }: EventTypeProps) => {
  return (
    <div>
      <p className="font-inter text-sm tracking-tight text-macl-gray">
        Select an event category?
      </p>
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

export const inputClassNames = {
  inputWrapper: "border-[0.33px] border-macd-gray shadow-none",
  label: "pb-1 opacity-60 text-sm tracking-tight",
  input:
    "font-bold tracking-tight placeholder:font-semibold focus:placeholder:opacity-50 placeholder:text-primary font-inter placeholder:text-sm",
};
