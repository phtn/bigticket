import type { XEvent } from "@/app/types";
import { type IconName } from "@/icons";
import { HyperList } from "@/ui/list";
import { Input } from "@nextui-org/react";
import { useMemo } from "react";
import { inputClassNames } from "../../editor";
import { EventDetailOption } from "./action-sheet";
import { BlockHeader } from "./components";
import type { EventField } from "./schema";

interface BasicContentProps {
  xEvent: XEvent | null;
  pending: boolean;
}

export const BasicContent = ({ xEvent, pending }: BasicContentProps) => {
  const basic_info: EventField[] = useMemo(
    () => [
      {
        name: "event_name",
        type: "text",
        label: "Event name",
        placeholder: "The name of the event",
        required: true,
        defaultValue: xEvent?.event_name,
      },
      {
        name: "event_desc",
        type: "text",
        label: "Describe what your event is about.",
        placeholder: "Provide a brief description of your event.",
        required: false,
        defaultValue: xEvent?.event_desc,
      },
      {
        name: "category",
        type: "radio",
        label: "Event Category",
        placeholder: "Select a category that fits your event.",
        required: false,
        defaultValue: xEvent?.category,
      },
    ],
    [xEvent],
  );

  return (
    <div className="grid w-full grid-cols-1 gap-6 bg-ticket md:grid-cols-2 md:rounded-lg">
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
  data: EventField[];
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

const FieldItem = (field: EventField) =>
  field.type === "radio" ? (
    <EventDetailOption {...field} />
  ) : (
    <Input {...field} classNames={inputClassNames} />
  );
