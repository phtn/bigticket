import { HyperList } from "@/ui/list";
import { Form } from "@nextui-org/react";
import {
  type ChangeEvent,
  type ReactNode,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EventDetailActionSheet } from "../action-sheet";
import { BlockHeader } from "../components";
import {
  BasicInfoSchema,
  type BasicInfoType,
  type EventField,
} from "../schema";
import { useEventDetail } from "../../email/ctx";
import { useMoment } from "@/hooks/useMoment";
import { EventCategory, EventDate } from "../../../../../create/components";
import { Nebula } from "../";
import { Hyper } from "@/ui/button/button";
import { type SelectEvent } from "convex/events/d";
import { useFormStateBasic } from "./store";
import {
  EventDetailItem,
  FieldBlock,
  FieldItem,
  SwitchItem,
} from "./components";
import type { BasicContentProps } from "./types";
import { useConvexCtx } from "@/app/ctx/convex";
import { awaitPromise } from "@/utils/helpers";
import { useQuery } from "convex/react";
import { api } from "@vx/api";
import { useConvexUtils } from "@/app/ctx/convex/useConvexUtils";

export const BasicContent = ({ event_id, pending }: BasicContentProps) => {
  const [x, setx] = useState<SelectEvent | null>(null);
  const { q } = useConvexUtils();
  const qEvent = useQuery(api.events.get.byId, { id: q(event_id) });

  const {
    is_online,
    is_private,
    category,
    subcategory,
    start_date,
    end_date,
    event_desc,
    event_name,
    event_url,
    venue_name,
    venue_address,
    setVenueName,
    setVenueAddress,
    reset,
    setEvent,
    setCategory,
    setSubcategory,
    setStartDate,
    setEndDate,
    event,
  } = useFormStateBasic();

  useEffect(() => {
    if (qEvent) {
      setx(qEvent);
      setEvent(qEvent);
      reset({
        is_online: qEvent.is_online ?? false,
        is_private: qEvent.is_private ?? false,
        category: qEvent.category ?? "party",
        subcategory: qEvent.subcategory ?? "nightlife",
        start_date: qEvent.start_date ?? Date.now(),
        end_date: qEvent.end_date ?? Date.now() + 36000000,
        event_name: qEvent.event_name,
        event_desc: qEvent.event_desc,
        event_url: qEvent.event_url,
        venue_name: qEvent.event_geo ?? qEvent.venue_name ?? "",
        venue_address: qEvent.venue_address ?? "",
      });
    }
  }, [qEvent, reset, setEvent]);

  const initialValues: BasicInfoType | null = useMemo(() => {
    if (!x) return null;
    return {
      event_name,
      event_desc,
      event_url,
      is_online,
      is_private,
      category,
      venue_name,
      venue_address,
      subcategory,
      start_date,
      end_date,
    };
  }, [
    x,
    event_name,
    event_desc,
    event_url,
    is_online,
    is_private,
    category,
    subcategory,
    start_date,
    end_date,
    venue_name,
    venue_address,
  ]);

  const { vxEvents } = useConvexCtx();

  const updateEventBasicInfo = useCallback(
    async (id: string, basicInfo: BasicInfoType) =>
      await vxEvents.mut.updateEventBasicInfo({ id, basicInfo }),
    [vxEvents.mut],
  );

  const saveFn = useCallback(
    async (initialValues: BasicInfoType | null, fd: FormData) => {
      if (!event?.event_id) return null;
      const updates = BasicInfoSchema.safeParse({
        event_name: fd.get("event_name") as string,
        event_desc: fd.get("event_desc") as string,
        event_url: fd.get("event_url") as string,
        venue_name: fd.get("venue_name") as string,
        venue_address: fd.get("venue_address") as string,
      });

      if (updates.error) {
        console.error(updates.error);
        return null;
      }
      const formData = {
        ...updates.data,
      };
      const payload = {
        ...formData,
        is_online,
        is_private,
        start_date,
        category,
        subcategory,
        end_date,
      };
      const promise = updateEventBasicInfo(event.event_id, payload);
      await awaitPromise(promise);
      reset(payload);

      return payload;
    },
    [
      is_online,
      is_private,
      category,
      subcategory,
      start_date,
      end_date,
      updateEventBasicInfo,
      reset,
      event?.event_id,
    ],
  );

  const { selectedEventDetail } = useEventDetail();

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategory(value);
    },
    [setCategory],
  );

  const handleSubcategoryChange = useCallback(
    (value: string) => {
      setSubcategory(value);
    },
    [setSubcategory],
  );

  const handleChangeStartDate = useCallback(
    (start: number) => {
      setStartDate(start);
      setEndDate(start + 3600000);
    },
    [setStartDate, setEndDate],
  );

  const handleChangeEndDate = useCallback(
    (end: number) => {
      setEndDate(end);
    },
    [setEndDate],
  );

  const render = useCallback(() => {
    switch (selectedEventDetail) {
      case "category":
        return (
          <EventCategory value={category} onChange={handleCategoryChange} />
        );
      case "subcategory":
        return (
          <EventCategory
            value={subcategory}
            onChange={handleSubcategoryChange}
          />
        );
      case "start_date":
        return (
          <EventDate
            label="Start"
            value={start_date}
            onChange={handleChangeStartDate}
          />
        );
      case "end_date":
        return (
          <EventDate
            label="End"
            value={end_date}
            onChange={handleChangeEndDate}
          />
        );
    }
  }, [
    selectedEventDetail,
    category,
    subcategory,
    start_date,
    end_date,
    handleSubcategoryChange,
    handleCategoryChange,
    handleChangeStartDate,
    handleChangeEndDate,
  ]);

  const [state, action] = useActionState(saveFn, initialValues);

  const basic_info: EventField[] = useMemo(
    () => [
      {
        name: "event_name",
        type: "text",
        label: "Event name",
        value: state?.event_name ?? event_name,
        placeholder: "The name of the event",
        required: true,
      },
      {
        name: "event_desc",
        type: "text",
        label: "A brief description of your event.",
        placeholder: "What best describes your event?",
        required: false,
        value: state?.event_desc ?? event_desc,
      },
      {
        name: "event_url",
        type: "text",
        label: "Website URL",
        placeholder: "Your event's official website.",
        required: false,
        value: state?.event_url ?? event_url,
      },
    ],
    [
      event_name,
      event_desc,
      event_url,
      state?.event_url,
      state?.event_desc,
      state?.event_name,
    ],
  );

  const access_info: EventField[] = useMemo(
    () => [
      {
        name: "is_online",
        type: "checkbox",
        checked: state?.is_online,
        label: "online--onsite",
        placeholder: "Access.",
        required: true,
      },
      {
        name: "is_private",
        type: "checkbox",
        checked: state?.is_private,
        label: "private--public",
        placeholder: "Audience.",
        required: true,
      },
    ],
    [state],
  );
  const cat_info: EventField[] = useMemo(
    () => [
      {
        name: "category",
        label: "Category",
        value: state?.category ?? category,
      },
      {
        name: "subcategory",
        label: "Subcategory",
        value: state?.subcategory ?? subcategory,
      },
    ],
    [state?.category, state?.subcategory, category, subcategory],
  );

  const BasicInfoBlock = useCallback(() => {
    return <FieldBlock data={basic_info} pending={pending} />;
  }, [basic_info, pending]);

  const VenueFields = useCallback(() => {
    const handleChangeVenueName = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setVenueName(e.target.value);
    };
    const handleChangeVenueAddress = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setVenueAddress(e.target.value);
    };

    const venue_fields: EventField[] = [
      {
        label: "Event Venue",
        value: state?.venue_name ?? venue_name,
        name: "venue_name",
        type: "text",
        placeholder: "Venue name",
        onChange: handleChangeVenueName,
      },
      {
        label: "Complete Address",
        value: state?.venue_address ?? venue_address,
        name: "venue_address",
        type: "text",
        placeholder: "Venue address",
        onChange: handleChangeVenueAddress,
      },
    ];
    return (
      <HyperList
        container="w-full space-y-6"
        data={venue_fields}
        component={FieldItem}
        keyId="name"
        delay={0.2}
      />
    );
  }, [venue_name, venue_address, state, setVenueName, setVenueAddress]);

  return (
    <Nebula>
      <Form action={action}>
        <div className="grid w-full grid-cols-1 gap-0 pb-6 md:grid-cols-2 md:rounded-lg lg:grid-cols-3 xl:gap-6">
          <BasicInfoBlock />
          <TypeAndCategory>
            <HyperList
              keyId="name"
              container="xl:flex w-full xl:space-y-0 space-y-6 xl:space-x-6"
              itemStyle="w-full"
              data={access_info}
              component={SwitchItem}
            />

            <CategoryFields data={cat_info} />
          </TypeAndCategory>
          <DateTimeVenue>
            <DateTimeFields />
            <VenueFields />
          </DateTimeVenue>
        </div>
        <div className="flex h-24 w-full items-center justify-end px-6">
          <div className="w-full max-w-sm rounded-[9px] border border-secondary bg-coal md:max-w-fit">
            <Hyper
              label="Save"
              type="submit"
              end="square-arrow-up-right"
              fullWidth
              rounded
              dark
              xl
            />
          </div>
        </div>
        <EventDetailActionSheet>{render()}</EventDetailActionSheet>
      </Form>
    </Nebula>
  );
};

export const TypeAndCategory = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader label={"Category"} icon={"settings-01"} />
      {children}
    </div>
  );
};

const CategoryFields = ({ data }: { data: EventField[] }) => {
  return (
    <div className="w-full space-y-6">
      <HyperList
        delay={0.1}
        keyId="name"
        data={data}
        component={EventDetailItem}
        container="relative w-full space-y-6"
      />
    </div>
  );
};

const DateTimeVenue = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader label={"date, time & venue"} icon={"calendar-setting-01"} />
      <div className="w-full space-y-6">{children}</div>
    </div>
  );
};

const DateTimeFields = () => {
  const { start_date, end_date } = useFormStateBasic();
  const { start_time, end_time } = useMoment({
    start: start_date,
    end: end_date,
  });

  const dt_fields: EventField[] = useMemo(
    () => [
      {
        label: "Start・Date・Time",
        value: `${start_time.date} ・ ${start_time.full}`,
        name: "start_date",
      },
      {
        label: "End・Date・Time",
        value: `${end_time.date} ・ ${end_time.full}`,
        name: "end_date",
      },
    ],
    [end_time, start_time],
  );

  return (
    <HyperList
      container="grid w-full grid-cols-2 gap-6"
      data={dt_fields}
      component={EventDetailItem}
      keyId="name"
      delay={0.1}
    />
  );
};
