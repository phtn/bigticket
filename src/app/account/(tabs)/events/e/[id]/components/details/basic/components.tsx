import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Input, Switch } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { inputClassNames } from "../../../editor";
import { EventDetailOption } from "../action-sheet";
import { BlockHeader } from "../components";
import { type EventField } from "../schema";
import { type FieldBlockProps } from "./types";

export const FieldBlock = ({ pending, data }: FieldBlockProps) => {
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader
        label={"Primary Info"}
        icon={pending ? "spinners-bouncing-ball" : "arrow-right-02"}
      />
      <HyperList
        data={data}
        container="space-y-6"
        component={FieldItem}
        delay={0}
      />
    </div>
  );
};

export const FieldItem = (field: EventField) => {
  const [value, setValue] = useState(field.value);
  const handleFocus = useCallback(() => {
    setValue(undefined);
  }, []);
  return (
    <Input
      id={field.name}
      name={field.name}
      type={field.type}
      label={field.label}
      onFocus={handleFocus}
      placeholder={field.placeholder}
      isRequired={field.required}
      value={value}
      classNames={inputClassNames}
    />
  );
};

export const EventDetailItem = (item: EventField) => (
  <EventDetailOption
    key={item.name}
    label={item.label}
    value={item.value}
    name={item.name}
  />
);

export const SwitchItem = (field: EventField) => {
  const [checked, setChecked] = useState(field.checked);
  const [on, off] = String(field.label as string).split("--");
  const handleChange = useCallback(() => {
    setChecked((prev) => !prev);
  }, []);
  return (
    <Switch
      name={field.name}
      checked={checked}
      defaultChecked={checked}
      onChange={handleChange}
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse overflow-hidden w-full max-w-md bg-content1 hover:bg-cake items-center",
          "justify-between cursor-pointer rounded-xl gap-2 py-3 px-2",
          "data-[selected=true]:border-primary",
        ),
        wrapper: "bg-teal-400",
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
