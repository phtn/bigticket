"use client";

import { getUserID } from "@/app/actions";
import { ConvexCtx } from "@/app/ctx/convex";
import { onSuccess } from "@/app/ctx/toast";
import { Icon, type IconName } from "@/icons";
import { ButtonIcon } from "@/ui/button";
import { Hyper } from "@/ui/button/button";
import { Carousel } from "@/ui/carousel";
import { HyperList } from "@/ui/list";
import { Err } from "@/utils/helpers";
import { Form, Input, Tab, Tabs } from "@nextui-org/react";
import type { InsertEvent, VIP, SelectEvent } from "convex/events/d";
import {
  use,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type JSX,
  type MouseEvent,
} from "react";
import { CoverPhoto } from "./components/cover-photo";
import { ImageQuery } from "./components/pexels";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtxProvider } from "./ctx";
import { basic_info, type EventField, vip_info, VIPZod } from "./schema";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const { events } = use(ConvexCtx)!;
  const [event_id] = id.split("---");
  const [event, setEvent] = useState<SelectEvent | null>(null);
  const [user_id, setUserId] = useState<string>();

  const get = useCallback(async () => {
    setEvent(await events.get.byId(event_id!));
    setUserId(await getUserID());
  }, [events.get, event_id]);

  useEffect(() => {
    get().catch(Err);
  }, [get]);

  const tabs: { value: string; title: string; content: JSX.Element }[] =
    useMemo(
      () => [
        {
          value: "basic_info",
          title: "Basic Info",
          content: <BasicContent />,
        },
        {
          value: "tickets",
          title: "Tickets",
          content: <BasicContent />,
        },
        {
          value: "vips",
          title: "VIPs",
          content: <VIPContent event={event} user_id={user_id} />,
        },
      ],
      [event, user_id],
    );

  return (
    <EventEditorCtxProvider>
      <main className="h-full bg-gray-100">
        <Topbar event_name={event?.event_name} />
        <ImageQuery category={event?.category} />

        <div className="h-full md:px-4">
          <Carousel>
            <div className="grid h-fit w-full grid-cols-1 gap-6 md:min-h-[420px] md:grid-cols-2 md:px-4">
              <CoverPhoto id={event_id} cover_url={event?.cover_url} />
              <TicketPhoto event={event} />
            </div>
          </Carousel>

          <div className="w-full p-2 text-xs md:p-4">
            <div className="flex h-20 items-center">
              <h2 className="flex items-center gap-2">
                <Icon name="PencilEdit" className="size-4" />
                <span className="font-inter text-lg font-semibold tracking-tighter">
                  Edit Event Details
                </span>
              </h2>
            </div>

            <div className="h-full py-6">
              <Tabs
                variant="underlined"
                className="w-full"
                classNames={{
                  panel: "w-full md:px-4",
                  tabContent: "font-medium tracking-tight",
                }}
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value} title={tab.title}>
                    {tab.content}
                  </Tab>
                ))}
              </Tabs>
            </div>
            <div className="h-96 bg-gray-300 py-8"></div>
          </div>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};

const BasicContent = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
      <FieldBlock data={basic_info} label="Basic Info" icon="ArrowRight" />
      <FieldBlock
        data={basic_info}
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
  <div className="w-full space-y-6 rounded-sm border-[0.33px] border-primary bg-god p-6">
    <div className="flex items-center gap-1.5 text-sm">
      <Icon name={icon} className="size-5 text-peach" />
      <span className="font-inter font-medium tracking-tight">{label}</span>
    </div>
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
  />
);

interface VIPBlockProps {
  data: EventField<VIP>[];
  label: string;
  icon: IconName;
  delay?: number;
}
interface VIPContentProps {
  event: SelectEvent | null;
  user_id: string | undefined;
}
const VIPContent = ({ event, user_id }: VIPContentProps) => {
  const initialState: VIP = {
    name: "",
    email: "",
    ticket_count: 1,
  };

  const { events } = use(ConvexCtx)!;
  const issued_tickets = useMemo(
    () => event?.vip_list?.reduce((acc, cur) => acc + cur.ticket_count, 0) ?? 0,
    [event],
  );

  const updateVIPList = useCallback(
    async (data: VIP) => {
      if (!event?.event_id) return;
      return await events.update.vip(event?.event_id, data);
    },
    [event?.event_id, events.update],
  );

  const addVIP = (initialState: VIP | undefined, fd: FormData) => {
    const vip = VIPZod.safeParse({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      ticket_count: parseInt(fd.get("ticket_count") as string),
    });

    if (vip.error) {
      console.log(vip.error);
      return;
    }
    console.log(vip.data);
    updateVIPList({ ...vip.data, created_by: user_id, updated_at: Date.now() })
      .then(() => {
        onSuccess("Added VIP");
      })
      .catch(Err);
    return { ...vip.data, created_by: user_id, updated_at: Date.now() };
  };
  const [state, action, pending] = useActionState(addVIP, initialState);
  return (
    <Form action={action}>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <VIPBlock
          data={vip_info}
          label="Create and Send VIP tickets."
          icon="VIPIcon2"
        />
      </div>
      <div className="flex h-16 w-full items-center justify-between pe-3 md:w-1/2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-fit items-center gap-3 rounded-sm border border-primary/40 px-3">
            <p className="text-sm font-semibold text-peach">0</p>
            <p className="font-inter text-xs font-semibold tracking-tight">
              Claimed
            </p>
          </div>
          <div className="flex h-10 w-fit items-center gap-3 rounded-sm border border-primary/40 px-3">
            <p className="text-sm font-semibold text-peach">{issued_tickets}</p>
            <p className="font-inter text-xs font-semibold tracking-tight">
              Issued
            </p>
          </div>
        </div>
        <Hyper
          disabled={pending || state?.email === ""}
          loading={pending}
          type="submit"
          label="Save"
          dark
        />
      </div>
    </Form>
  );
};

const VIPItem = (field: EventField<VIP>) => {
  const [value, setValue] = useState<number>(1);
  const [strValue, setStrValue] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (field.name === "ticket_count") {
      setValue((prev) =>
        prev ? +prev + parseInt(e.target.value) : parseInt(e.target.value),
      );
    }

    setStrValue(e.target.value);
  };

  const handlePress = useCallback(
    (n: number) => (e: MouseEvent) => {
      e.preventDefault();
      setValue((prev) => prev + n);
    },
    [],
  );

  return (
    <Input
      label={field.label}
      name={field.name}
      type={field.type}
      onChange={handleChange}
      value={field.name === "ticket_count" ? String(value) : strValue}
      classNames={inputClassNames}
      placeholder={field.placeholder}
      isRequired={field.required}
      defaultValue={field.defaultValue}
      validationBehavior="native"
      className="appearance-none"
      endContent={
        field.name === "ticket_count" ? (
          <div className="-mb-3 -mr-1.5 flex items-end md:-mr-2.5">
            <ButtonIcon
              onClick={handlePress(-1)}
              icon="Minus"
              className="size-5"
            />
            <ButtonIcon
              onClick={handlePress(1)}
              icon="Plus"
              className="size-5"
            />
          </div>
        ) : null
      }
    />
  );
};
const VIPBlock = ({ data, icon, label, delay = 0 }: VIPBlockProps) => (
  <div className="w-full space-y-4 rounded-sm border-[0.33px] border-primary bg-god px-4 py-5 md:p-6">
    <div className="flex items-center gap-1.5 text-sm">
      <Icon name={icon} className="size-5 text-peach" />
      <span className="font-inter font-medium tracking-tight">{label}</span>
    </div>
    <section className="h-fit rounded-xl border-[1px] border-primary/40 bg-secondary/10 p-2 text-justify text-xs leading-4 md:p-3 md:text-sm md:leading-5">
      Fill out the name, email of the VIP and add the number of tickets. You can
      add multiple VIPs by clicking the save button. You can reduce the number
      of tickets given by entering a negative value.
    </section>
    <HyperList
      data={data}
      container="xl:space-y-0 space-y-6 xl:grid sm:border-t border-primary/40 md:border-l xl:grid-cols-8 xl:space-x-[0.33px] xl:w-full"
      itemStyle="whitespace-nowrap first:col-span-3 col-span-3 last:col-span-2"
      component={VIPItem}
      delay={delay}
      keyId="name"
    />
  </div>
);

const inputClassNames = {
  innerWrapper:
    "lg:border-t-0 lg:border-l-0 border border-macd-gray bg-white p-3 shadow-none",
  inputWrapper: "h-16 p-0 bg-white data-hover:bg-white shadow-none",
  label: "ps-3 pb-0.5 opacity-60 text-sm tracking-tight",
  input:
    "font-bold tracking-tight placeholder:font-semibold shadow-none focus:placeholder:opacity-40 placeholder:text-primary font-inter placeholder:text-sm",
};
