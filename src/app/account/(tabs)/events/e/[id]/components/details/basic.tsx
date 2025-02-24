import type { XEvent } from "@/app/types";
import { type IconName } from "@/icons";
import { HyperList } from "@/ui/list";
import { Input } from "@nextui-org/react";
import { use, useCallback, useMemo, useState } from "react";
import { inputClassNames } from "../../editor";
import { EventDetailActionSheet, EventDetailOption } from "./action-sheet";
import { BlockHeader } from "./components";
import type { EventDetailField, EventField } from "./schema";
import { EventDetailCtx } from "./ctx";
import { useMoment } from "@/hooks/useMoment";
import { EventCategory } from "../../../../create/components";

interface BasicContentProps {
  xEvent: XEvent | null;
  pending: boolean;
}

export const BasicContent = ({ xEvent, pending }: BasicContentProps) => {
  const basic_info: (EventField | EventField[])[] = useMemo(
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
      [
        {
          name: "category",
          type: "radio",
          label: "Event Category",
          placeholder: "Select a category that fits your event.",
          required: false,
          defaultValue: xEvent?.category,
          value: xEvent?.category,
        },
        {
          name: "event_type",
          type: "radio",
          label: "Event Type",
          placeholder: "Select event type.",
          required: false,
          defaultValue: xEvent?.event_type,
          value: xEvent?.event_type,
        },
      ],
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
      <BasicOptions xEvent={xEvent} />
    </div>
  );
};

interface FieldBlockProps {
  data: (EventField | EventField[])[];
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
    />
  </div>
);

const FieldItem = (field: EventField | EventField[]) =>
  Array.isArray(field) ? (
    field.map((subfield) => (
      <div className="flex items-center gap-6 bg-tan" key={subfield.name}>
        <EventDetailOption {...subfield} />
      </div>
    ))
  ) : (
    <Input {...field} classNames={inputClassNames} />
  );

interface BasicOptionsProps {
  xEvent: XEvent | null;
}
const BasicOptions = ({ xEvent }: BasicOptionsProps) => {
  const [category] = useState(xEvent?.category);
  const { selectedEventDetail } = use(EventDetailCtx)!;

  const detail_data = useMemo(() => [], []);

  const handleCategoryChange = () => {
    console.log("");
  };
  const renderDetailFields = useCallback(() => {
    switch (selectedEventDetail) {
      case "category":
        return (
          <EventCategory value={category} onChange={handleCategoryChange} />
        );
    }
  }, [selectedEventDetail, category]);
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader label={"date, time & venue"} icon={"TimeSched"} />
      <div className="w-full gap-6">
        <BasicFields render={renderDetailFields} data={detail_data}>
          <div></div>
        </BasicFields>
      </div>
    </div>
  );
};

const BasicFields = ({ children, render, data }: EventDetailField) => {
  const { selectedEventDetail } = use(EventDetailCtx)!;
  const { start_time, end_time } = useMoment({
    start: data[0] as number,
    end: data[1] as number,
  });

  const fields: EventField[] = useMemo(
    () => [
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

      {
        label: "Name of the Event Place/Venue",
        value: data[2] as string,
        name: "venue_name",
      },
      {
        label: "Complete Address",
        value: data[3] as string,
        name: "venue_address",
      },
      {
        label: "Tickets",
        value: data[4] as string,
        name: "ticket_count",
      },
    ],
    [data, end_time, start_time],
  );

  return (
    <div className="w-full space-y-6">
      {/* <div className="grid w-full grid-cols-2 gap-3 md:px-2"> */}
      <HyperList
        container="grid w-full grid-cols-2 gap-6"
        data={fields.slice(0, 2)}
        component={EventDetailItem}
        keyId="name"
        delay={0.1}
      />
      <HyperList
        container="grid w-full grid-cols-1 gap-6"
        data={fields.slice(3)}
        component={EventDetailItem}
        keyId="name"
        delay={0.2}
      />
      <EventDetailActionSheet>
        {render(selectedEventDetail)}
        {children}
      </EventDetailActionSheet>
    </div>
  );
};

const EventDetailItem = (item: EventField) => (
  <EventDetailOption
    key={item.name}
    label={item.label}
    value={item.value}
    name={item.name}
  />
);
