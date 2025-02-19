import type { InsertEvent, SelectEvent } from "convex/events/d";
import type { EventField } from "./schema";
import { useMemo } from "react";
import { type IconName } from "@/icons";
import { HyperList } from "@/ui/list";
import { Input } from "@nextui-org/react";
import { inputClassNames } from "../../content";
import { BlockHeader } from "./components";

interface BasicContentProps {
  event: SelectEvent | null;
  pending: boolean;
}

export const BasicContent = ({ event, pending }: BasicContentProps) => {
  const basic_info: EventField<InsertEvent>[] = useMemo(
    () => [
      {
        name: "event_name",
        type: "text",
        label: "Event name",
        placeholder: "The name of the event",
        required: true,
        defaultValue: event?.event_name,
      },
      {
        name: "event_desc",
        type: "text",
        label: "Describe what your event is about.",
        placeholder: "Provide a brief description of your event.",
        required: false,
        defaultValue: event?.event_desc,
      },
      {
        name: "category",
        type: "text",
        label: "Event Category",
        placeholder: "Select a category that fits your event.",
        required: false,
        defaultValue: event?.category,
      },
    ],
    [event?.event_name, event?.event_desc, event?.category],
  );

  return (
    <div className="grid w-full grid-cols-1 gap-6 bg-primary md:grid-cols-2 md:rounded">
      <FieldBlock
        data={pending ? [] : basic_info}
        label="Basic Info"
        icon={pending ? "SpinnerBall" : "ArrowRight"}
      />
      <FieldBlock
        data={[]}
        label="Date, Time and Place"
        icon="TimeSched"
        delay={0.2}
      />
    </div>
  );
};

interface FieldBlockProps {
  data: EventField<InsertEvent>[];
  label: string;
  icon: IconName;
  delay?: number;
}

const FieldBlock = ({ data, icon, label, delay = 0 }: FieldBlockProps) => (
  <div className="w-full space-y-6 p-6">
    <BlockHeader label={label} icon={icon} />
    <HyperList
      data={data}
      container="space-y-6"
      component={FieldItem}
      delay={delay}
      keyId="name"
    />
  </div>
);

const FieldItem = (field: EventField<InsertEvent>) => (
  <Input
    label={field.label}
    placeholder={field.placeholder}
    name={field.name}
    classNames={inputClassNames}
    isRequired={field.required}
    defaultValue={field.defaultValue}
  />
);
