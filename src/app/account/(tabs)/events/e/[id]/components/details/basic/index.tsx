import { HyperList } from "@/ui/list";
import { Form } from "@nextui-org/react";
import {
  type ChangeEvent,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { EventDetailActionSheet } from "../action-sheet";
import { BlockHeader } from "../components";
import { access_info, PrimaryInfoSchema, type EventField } from "../schema";
import { useEventDetail } from "../ctx";
import { useMoment } from "@/hooks/useMoment";
import { EventCategory, EventDate } from "../../../../../create/components";
import { Nebula } from "../";
import { Hyper } from "@/ui/button/button";
import { type BasicInfo } from "convex/events/d";
import { useFormStateEvent } from "./store";
import {
  EventDetailItem,
  FieldBlock,
  FieldItem,
  SwitchItem,
} from "./components";
import type { BasicContentProps } from "./types";
import { useConvexCtx } from "@/app/ctx/convex";
import { asyncR } from "@/utils/helpers";

export const BasicContent = ({ xEvent: x, pending }: BasicContentProps) => {
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
    reset,
    setXEvent,
    setCategory,
    setSubcategory,
    setStartDate,
    setEndDate,
    xEvent,
  } = useFormStateEvent();

  useEffect(() => {
    setXEvent(x);
    reset({
      is_online: xEvent?.is_online ?? false,
      is_private: xEvent?.is_private ?? false,
      category: xEvent?.category ?? "party",
      start_date: xEvent?.start_date ?? 0,
      end_date: xEvent?.end_date ?? 0,
      event_name: xEvent?.event_name ?? "Event name",
      event_desc: xEvent?.event_desc,
      event_url: xEvent?.event_url,
      venue_name: xEvent?.venue_name,
      venue_address: xEvent?.venue_address,
    });
  }, [x, setXEvent, xEvent, reset]);

  const initialValues: BasicInfo | null = useMemo(() => {
    if (!xEvent?.event_id) return null;
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
    };
  }, [
    xEvent,
    category,
    subcategory,
    is_online,
    is_private,
    event_desc,
    event_url,
    event_name,
    venue_name,
    venue_address,
  ]);

  const { vxEvents } = useConvexCtx();

  const updateEventBasicInfo = useCallback(
    async (id: string, basicInfo: BasicInfo) =>
      await vxEvents.mut.updateEventBasicInfo({ id, basicInfo }),
    [vxEvents.mut],
  );

  const saveFn = useCallback(
    async (initialValues: BasicInfo | null, fd: FormData) => {
      if (!xEvent?.event_id) return null;
      const updates = PrimaryInfoSchema.safeParse({
        event_name: fd.get("event_name") as string,
        event_desc: fd.get("event_desc") as string,
        event_url: fd.get("event_url") as string,
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
        category,
        subcategory,
        start_date,
        end_date,
        venue_name,
        venue_address,
      };
      const promise = updateEventBasicInfo(xEvent.event_id, payload);

      await asyncR(promise);
      reset(payload);

      return formData;
    },
    [
      is_online,
      is_private,
      category,
      subcategory,
      start_date,
      end_date,
      venue_name,
      venue_address,
      updateEventBasicInfo,
      reset,
      xEvent?.event_id,
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

  const [, action] = useActionState(saveFn, initialValues);

  return (
    <Nebula>
      <Form action={action}>
        <div className="grid w-full grid-cols-1 gap-0 pb-6 md:grid-cols-2 md:rounded-lg lg:grid-cols-3 xl:gap-6">
          <FieldBlock pending={pending} />
          <TypeAndCategory />
          <DateTimeVenue />
        </div>
        <div className="flex h-24 w-full items-center justify-end px-6">
          <div className="w-full max-w-sm rounded-[9px] border border-secondary bg-coal md:max-w-fit">
            <Hyper
              label="Save"
              type="submit"
              end="ArrowRightUp"
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

export const TypeAndCategory = () => {
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader label={"Category"} icon={"Settings2"} />
      <HyperList
        keyId="name"
        container="xl:flex w-full xl:space-y-0 space-y-6 xl:space-x-6"
        itemStyle="w-full"
        data={access_info}
        component={SwitchItem}
      />
      <CategoryFields />
    </div>
  );
};

const CategoryFields = () => {
  const { category, subcategory } = useFormStateEvent();

  const cat_info: EventField[] = useMemo(
    () => [
      {
        name: "category",
        label: "Category",
        value: category,
      },
      {
        name: "subcategory",
        label: "Subcategory",
        value: subcategory,
      },
    ],
    [category, subcategory],
  );
  return (
    <div className="w-full space-y-6">
      <HyperList
        delay={0.1}
        keyId="name"
        data={cat_info}
        component={EventDetailItem}
        container="relative w-full space-y-6"
      />
    </div>
  );
};

const DateTimeVenue = () => {
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader label={"date, time & venue"} icon={"TimeSched"} />
      <div className="w-full gap-6">
        <DateTimeFields />
      </div>
    </div>
  );
};

const DateTimeFields = () => {
  const {
    start_date,
    end_date,
    setVenueName,
    setVenueAddress,
    venue_name,
    venue_address,
  } = useFormStateEvent();
  const { start_time, end_time } = useMoment({
    start: start_date,
    end: end_date,
  });

  const handleChangeVenueName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setVenueName(e.target.value);
    },
    [setVenueName],
  );
  const handleChangeVenueAddress = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setVenueAddress(e.target.value);
    },
    [setVenueAddress],
  );

  const fields: EventField[] = useMemo(
    () => [
      {
        label: "Start Time",
        value: `${start_time.date} ・ ${start_time.full}`,
        name: "start_date",
      },
      {
        label: "End Time",
        value: `${end_time.date} ・ ${end_time.full}`,
        name: "end_date",
      },
      {
        label: "Name of Place ・ Venue",
        defaultValue: venue_name,
        name: "venue_name",
        placeholder: "Place・Venue Name.",
        onChange: handleChangeVenueName,
      },
      {
        label: "Complete Address",
        defaultValue: venue_address,
        name: "venue_address",
        placeholder: "Event venue address.",
        onChange: handleChangeVenueAddress,
      },
    ],
    [
      end_time,
      start_time,
      venue_name,
      venue_address,
      handleChangeVenueAddress,
      handleChangeVenueName,
    ],
  );

  return (
    <div className="w-full space-y-6">
      <HyperList
        container="grid w-full grid-cols-2 gap-6"
        data={fields.slice(0, 2)}
        component={EventDetailItem}
        keyId="name"
        delay={0.1}
      />
      <HyperList
        container="grid w-full grid-cols-1 gap-6"
        data={fields.slice(2)}
        component={FieldItem}
        keyId="name"
        delay={0.2}
      />
    </div>
  );
};
