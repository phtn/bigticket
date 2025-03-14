import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Input, Switch } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { inputClassNames, inputClassNamesRight } from "../../../editor";
import { EventDetailOption } from "../action-sheet";
import { BlockHeader } from "../components";
import { type EventField } from "../schema";
import { useFormStateTicket } from "./store";
import { type FieldBlockProps } from "./types";

export const FieldBlock = ({ pending, children }: FieldBlockProps) => {
  const { ticket_price, min_age, max_age } = useFormStateTicket();
  const ticket_info: EventField[] = useMemo(
    () => [
      {
        name: "ticket_price",
        type: "text",
        label: "Ticket Price",
        placeholder: "Ticket Price",
        required: false,
        value: ticket_price?.toString(),
      },
      {
        name: "min_age",
        type: "text",
        label: "Minimum Age Limit",
        placeholder: "Minimum age allowed for entry.",
        required: false,
        value: min_age?.toString(),
      },
      {
        name: "max_age",
        type: "text",
        label: "Maximum Age Limit",
        placeholder: "Maximum age allowed for entry.",
        required: false,
        value: max_age?.toString(),
      },
    ],
    [ticket_price, min_age, max_age],
  );
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader
        label={"Pricing & Admission"}
        icon={pending ? "spinners-3-dots-move" : "ticket-tilted"}
      />
      {children}
      <HyperList
        data={ticket_info.slice(0, 1)}
        container="space-y-6"
        component={NumberFieldItem}
        delay={0}
      />
      <HyperList
        data={ticket_info.slice(1)}
        container="flex justify-between gap-6 w-full"
        itemStyle="w-full"
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
export const NumberFieldItem = (field: EventField) => (
  <Input
    id={field.name}
    name={field.name}
    type={field.type}
    label={field.label}
    placeholder={field.value ?? field.placeholder}
    isRequired={field.required}
    defaultValue={field.value}
    value={undefined}
    classNames={inputClassNamesRight}
    startContent={<div className="px-0.5 text-lg font-medium">₱</div>}
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
  const {} = useFormStateTicket();
  const label = field.label as string;
  const [on, off] = label.split("--");
  const [checked, setChecked] = useState(false);
  const handleValueChange = (value: boolean) => {
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
