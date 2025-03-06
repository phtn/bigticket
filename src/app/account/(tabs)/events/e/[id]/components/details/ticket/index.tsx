import { HyperList } from "@/ui/list";
import { Form } from "@nextui-org/react";
import {
  type ChangeEvent,
  type MouseEvent,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { EventDetailActionSheet } from "../action-sheet";
import { BlockHeader } from "../components";
import { access_info, TicketInfoSchema, type EventField } from "../schema";
import { useEventDetail } from "../ctx";
import { useMoment } from "@/hooks/useMoment";
import { EventDate, TicketCount } from "../../../../../create/components";
import { Nebula } from "../";
import { Hyper } from "@/ui/button/button";
import { type TicketInfo } from "convex/events/d";
import { useFormStateTicket } from "./store";
import {
  EventDetailItem,
  FieldBlock,
  FieldItem,
  SwitchItem,
} from "./components";
import type { ContentProps } from "./types";
import { useConvexCtx } from "@/app/ctx/convex";
import { asyncR } from "@/utils/helpers";

export const TicketContent = ({ xEvent: x, pending }: ContentProps) => {
  const {
    xEvent,
    ticket_count,
    ticket_price,
    min_age,
    max_age,
    ticket_sales_open,
    ticket_sales_close,
    ticket_sales_limit,
    ticket_sales_estimate,
    ticket_sales_email,
    ticket_sales_phone,
    setTicketCount,
    setTicketSalesOpen,
    setTicketSalesClose,
    setXEvent,
    reset,
  } = useFormStateTicket();

  useEffect(() => {
    setXEvent(x);
    reset({
      ticket_count: xEvent?.ticket_count ?? 0,
      ticket_price: xEvent?.ticket_price ?? 0,
      min_age: xEvent?.min_age ?? 18,
      max_age: xEvent?.max_age ?? 42,
      ticket_sales_open: xEvent?.ticket_sales_open ?? 0,
      ticket_sales_close: xEvent?.ticket_sales_close ?? 0,
      ticket_sales_limit: xEvent?.ticket_sales_limit,
      ticket_sales_estimate: xEvent?.ticket_sales_estimate,
      ticket_sales_email: xEvent?.ticket_sales_email,
      ticket_sales_phone: xEvent?.ticket_sales_phone,
    });
  }, [x, setXEvent, xEvent, reset]);

  const initialValues: TicketInfo | null = useMemo(() => {
    if (!xEvent?.event_id) return null;
    return {
      ticket_count,
      ticket_price,
      min_age,
      max_age,
      ticket_sales_open,
      ticket_sales_close,
      ticket_sales_limit,
      ticket_sales_estimate,
      ticket_sales_email,
      ticket_sales_phone,
    };
  }, [
    xEvent?.event_id,
    ticket_count,
    ticket_price,
    min_age,
    max_age,
    ticket_sales_open,
    ticket_sales_close,
    ticket_sales_limit,
    ticket_sales_estimate,
    ticket_sales_email,
    ticket_sales_phone,
  ]);

  const { vxEvents } = useConvexCtx();

  const updateEventTicketInfo = useCallback(
    async (id: string, ticketInfo: TicketInfo) =>
      await vxEvents.mut.updateEventTicketInfo({ id, ticketInfo }),
    [vxEvents.mut],
  );

  const saveFn = useCallback(
    async (initialValues: TicketInfo | null, fd: FormData) => {
      if (!xEvent?.event_id) return null;
      const updates = TicketInfoSchema.safeParse({
        ticket_price: fd.get("ticket_price") as string,
        min_age: fd.get("min_age") as string,
        max_age: fd.get("max_age") as string,
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
        ticket_count,
        ticket_sales_open,
        ticket_sales_close,
        ticket_sales_limit,
        ticket_sales_estimate,
        ticket_sales_email,
        ticket_sales_phone,
      };
      const promise = updateEventTicketInfo(xEvent.event_id, payload);

      await asyncR(promise);
      reset(payload);

      return formData;
    },
    [
      ticket_count,
      ticket_sales_open,
      ticket_sales_close,
      ticket_sales_limit,
      ticket_sales_estimate,
      ticket_sales_email,
      ticket_sales_phone,
      updateEventTicketInfo,
      reset,
      xEvent?.event_id,
    ],
  );

  const { selectedEventDetail } = useEventDetail();

  const handleCustomTicketCount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTicketCount(+e.target.value);
    },
    [setTicketCount],
  );
  const handleSelectTicketCount = useCallback(
    (value: number) => (e: MouseEvent) => {
      e.preventDefault();
      setTicketCount(value);
    },
    [setTicketCount],
  );

  // const handleSubcategoryChange = useCallback(
  //   (value: string) => {
  //     setSubcategory(value);
  //   },
  //   [setSubcategory],
  // );

  const handleOpenDateChange = useCallback(
    (start: number) => {
      setTicketSalesOpen(start);
      setTicketSalesClose(start + 3600000);
    },
    [setTicketSalesOpen, setTicketSalesClose],
  );

  const handleCloseDateChange = useCallback(
    (end: number) => {
      setTicketSalesClose(end);
    },
    [setTicketSalesClose],
  );

  const render = useCallback(() => {
    switch (selectedEventDetail) {
      case "ticket_count":
        return (
          <TicketCount
            className="h-80"
            ticketCount={ticket_count ?? 100}
            handleSelectTicketCount={handleSelectTicketCount}
            handleCustomTicketCount={handleCustomTicketCount}
          />
        );
      case "start_date":
        return (
          <EventDate
            label="Start"
            value={ticket_sales_open}
            onChange={handleOpenDateChange}
          />
        );
      case "end_date":
        return (
          <EventDate
            label="End"
            value={ticket_sales_close}
            onChange={handleCloseDateChange}
          />
        );
    }
  }, [
    selectedEventDetail,
    ticket_sales_open,
    ticket_sales_close,
    handleCloseDateChange,
    handleOpenDateChange,
    handleSelectTicketCount,
    handleCustomTicketCount,
    ticket_count,
  ]);

  const [, action] = useActionState(saveFn, initialValues);

  return (
    <Nebula>
      <Form action={action}>
        <div className="grid w-full grid-cols-1 gap-0 pb-6 md:grid-cols-2 md:rounded-lg lg:grid-cols-3 xl:gap-6">
          <FieldBlock pending={pending}>
            <EventDetailItem
              label="Ticket Count"
              name="ticket_count"
              value={String(ticket_count)}
            />
          </FieldBlock>
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
      <BlockHeader label={"Ticket Sales"} icon={"Ticket"} />
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
  const { ticket_sales_open, ticket_sales_close } = useFormStateTicket();

  const sales_info: EventField[] = useMemo(
    () => [
      {
        name: "ticket_sales_open",
        label: "Ticket Sales Open",
        value: String(ticket_sales_open),
      },
      {
        name: "ticket_sales_close",
        label: "Ticket Sales Close",
        value: String(ticket_sales_close),
      },
    ],
    [ticket_sales_open, ticket_sales_close],
  );
  return (
    <div className="w-full space-y-6">
      <HyperList
        delay={0.1}
        keyId="name"
        data={sales_info}
        component={EventDetailItem}
        container="relative w-full space-y-6"
      />
    </div>
  );
};

const DateTimeVenue = () => {
  return (
    <div className="w-full space-y-6 p-6">
      <BlockHeader label={"Support"} icon={"Support"} />
      <div className="w-full gap-6">
        <DateTimeFields />
      </div>
    </div>
  );
};

const DateTimeFields = () => {
  const {
    ticket_sales_open,
    ticket_sales_close,
    ticket_sales_limit,
    ticket_sales_estimate,
    setTicketSalesLimit,
    setTicketSalesEstimate,
  } = useFormStateTicket();
  const { start_time, end_time } = useMoment({
    start: ticket_sales_open,
    end: ticket_sales_close,
  });

  const handleChangeTicketSalesLimit = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTicketSalesLimit(+e.target.value);
    },
    [setTicketSalesLimit],
  );
  const handleChangeTicketSalesEstimate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTicketSalesEstimate(+e.target.value);
    },
    [setTicketSalesEstimate],
  );

  const fields: EventField[] = useMemo(
    () => [
      {
        label: "Sales Open・Date・Time",
        value: `${start_time.date} ・ ${start_time.full}`,
        name: "ticket_sales_open",
      },
      {
        label: "Sales Close・Date・Time",
        value: `${end_time.date} ・ ${end_time.full}`,
        name: "ticket_sales_close",
      },
      {
        label: "Ticket Sales Limit",
        defaultValue: String(ticket_sales_limit),
        name: "ticket_sales_limit",
        placeholder: "Ticket sales limit.",
        onChange: handleChangeTicketSalesLimit,
      },
      {
        label: "Ticket Sales Estimate",
        defaultValue: String(ticket_sales_estimate),
        name: "ticket_sales_estimate",
        placeholder: "Ticket sales estimate.",
        onChange: handleChangeTicketSalesEstimate,
      },
    ],
    [
      end_time,
      start_time,
      ticket_sales_limit,
      ticket_sales_estimate,
      handleChangeTicketSalesLimit,
      handleChangeTicketSalesEstimate,
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
