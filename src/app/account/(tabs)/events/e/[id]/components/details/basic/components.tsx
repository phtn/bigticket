import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Input, Switch } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { inputClassNames } from "../../../editor";
import { EventDetailOption } from "../action-sheet";
import { BlockHeader } from "../components";
import { type EventField } from "../schema";
import { useFormStateBasic } from "./store";
import { type FieldBlockProps } from "./types";

export const FieldBlock = ({ pending }: FieldBlockProps) => {
  const { event_name, event_desc, event_url } = useFormStateBasic();
  const basic_info: EventField[] = useMemo(
    () => [
      {
        name: "event_name",
        type: "text",
        label: "Event name",
        placeholder: "The name of the event",
        required: true,
        value: event_name,
      },
      {
        name: "event_desc",
        type: "text",
        label: "A brief description of your event.",
        placeholder: "What best describes your event?",
        required: false,
        value: event_desc,
      },
      {
        name: "event_url",
        type: "text",
        label: "Website URL",
        placeholder: "Your event's official website.",
        required: false,
        value: event_url,
      },
    ],
    [event_name, event_desc, event_url],
  );
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader
        label={"Primary Info"}
        icon={pending ? "spinners-bouncing-ball" : "arrow-right-02"}
      />
      <HyperList
        data={basic_info}
        container="space-y-6"
        component={FieldItem}
        delay={0}
      />
    </div>
  );
};

export const FieldItem = (field: EventField) => (
  <Input
    id={field.name}
    name={field.name}
    type={field.type}
    label={field.label}
    placeholder={field.value ?? field.placeholder}
    isRequired={field.required}
    defaultValue={field.value}
    value={undefined}
    classNames={inputClassNames}
  />
);

export const EventDetailItem = (item: EventField) => (
  <EventDetailOption
    key={item.name}
    label={item.label}
    value={item.value}
    name={item.name}
  />
);

export const SwitchItem = (field: EventField) => {
  const { setIsOnline, setIsPrivate, is_online, is_private } =
    useFormStateBasic();
  const label = field.label as string;
  const [on, off] = label.split("--");
  const [checked, setChecked] = useState(
    field.name === "is_online" ? is_online : is_private,
  );
  const handleValueChange = (value: boolean) => {
    if (field.name === "is_online") {
      setIsOnline(value);
    } else if (field.name === "is_private") {
      setIsPrivate(value);
    }
    setChecked(value);
  };
  return (
    <Switch
      name={field.name}
      checked={checked}
      defaultChecked={checked}
      defaultValue={field.value}
      onValueChange={handleValueChange}
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse overflow-hidden w-full max-w-md bg-content1 hover:bg-cake items-center",
          "justify-between cursor-pointer rounded-xl gap-2 py-3 px-2",
          "data-[selected=true]:border-primary",
        ),
        wrapper: "bg-gray-200",
      }}
    >
      <div className="flex flex-col gap-1 whitespace-nowrap tracking-tight">
        <p className="text-sm font-semibold capitalize">
          {checked ? on : off} <span className="gap-1">event</span>
        </p>
        <p className="text-xs font-medium opacity-60">
          <span className="capitalize">{checked ? on : off}</span>{" "}
          {field.placeholder}
        </p>
      </div>
    </Switch>
  );
};
