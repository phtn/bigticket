import { ConvexCtx } from "@/app/ctx/convex";
import { onSuccess } from "@/app/ctx/toast";
import { type XEvent } from "@/app/types";
import { type IconName } from "@/icons";
import { ButtonIcon } from "@/ui/button";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err } from "@/utils/helpers";
import { Checkbox, Form, Input } from "@nextui-org/react";
import type { VIP } from "convex/events/d";
import {
  type ChangeEvent,
  type MouseEvent,
  use,
  useActionState,
  useCallback,
  useMemo,
  useState,
} from "react";
import { inputClassNames } from "../../editor";
import SendInvite from "../email/send-invite";
import { BlockHeader } from "./components";
import { vip_info, type VIPField, VIPZod } from "./schema";

interface VIPBlockProps {
  data: VIPField[];
  label: string;
  icon: IconName;
  delay?: number;
}
interface VIPContentProps {
  xEvent: XEvent | null;
  user_id: string | null;
}

export const VIPContent = ({ xEvent, user_id }: VIPContentProps) => {
  const [vipList, setVIPList] = useState<VIP[]>([]);
  const initialState: VIP = {
    name: "",
    email: "",
    ticket_count: 1,
  };

  const defaults = {
    checked: false,
    invitation_sent: false,
    tickets_claimed: false,
    tickets_used: 0,
  };

  const { events } = use(ConvexCtx)!;
  const issued_tickets = useMemo(
    () =>
      xEvent?.vip_list?.reduce((acc, cur) => acc + cur.ticket_count, 0) ?? 0,
    [xEvent],
  );

  const updateVIPList = useCallback(
    async (data: VIP) => {
      if (!xEvent?.event_id) return;
      setVIPList((prev) => [...prev, data]);
      return await events.update.vip(xEvent?.event_id, data);
    },
    [xEvent?.event_id, events.update],
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
    updateVIPList({
      ...defaults,
      ...vip.data,
      created_by: user_id,
      event_id: xEvent?.event_id,
      event_name: xEvent?.event_name,
      updated_at: Date.now(),
    })
      .then(() => {
        onSuccess("Added VIP");
      })
      .catch(Err);
    return {
      ...vip.data,
    };
  };
  const [, action, pending] = useActionState(addVIP, initialState);

  const VIPGuestList = useCallback(() => {
    return (
      <section className="relative min-h-96 border-gray-500 bg-primary text-chalk md:border-y md:border-r">
        <div className="h-full w-full overflow-hidden overflow-y-scroll">
          <div className="flex h-11 w-full items-center justify-between border-b border-gray-500 px-3 font-inter text-tiny font-bold">
            <div className="flex w-full items-center justify-between gap-4 md:justify-start">
              <span>VIP Guest List</span>
              <span className="font-sans">
                {xEvent?.vip_list?.length ?? vipList.length}
              </span>
            </div>
          </div>
          <HyperList
            data={xEvent?.vip_list ?? vipList}
            component={VIPListItem}
            container=""
            keyId="email"
          />
        </div>
        <div className="absolute bottom-2 right-2">
          <SendInvite vip_list={xEvent?.vip_list} />
        </div>
      </section>
    );
  }, [xEvent?.vip_list, vipList]);

  return (
    <Form action={action}>
      <div className="grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-2 md:gap-0 md:rounded-lg">
        <section className="h-fit space-y-8 border-b border-gray-500 bg-primary md:h-fit md:border">
          <VIPBlock
            data={vip_info}
            label="Create VIP Guest List"
            icon="VIPIcon2"
          />

          <div className="flex h-1/6 w-full items-end justify-between bg-primary">
            <div className="flex w-full items-center border-t border-gray-500 text-chalk">
              <div className="flex h-10 w-full items-center justify-between gap-3 border-r border-gray-500 px-3">
                <p className="font-inter text-xs font-semibold tracking-tight">
                  Claimed
                </p>
                <p className="font-sans text-sm">0</p>
              </div>
              <div className="flex h-10 w-full items-center justify-between gap-3 border-r border-gray-500 px-3">
                <p className="font-inter text-xs font-semibold tracking-tight">
                  Issued
                </p>
                <p className="font-sans text-sm">{issued_tickets}</p>
              </div>
              <Hyper
                disabled={pending}
                loading={pending}
                type="submit"
                label="Add"
                end="Plus"
                dark
              />
            </div>
          </div>
        </section>
        <VIPGuestList />
      </div>
    </Form>
  );
};

const VIPListItem = (vip: VIP) => {
  const handleChangeSelected = useCallback(
    (email: string) => (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.value) {
        console.log(e.target.value, email);
      }
    },
    [],
  );
  return (
    <div className="grid w-full grid-cols-12 overflow-clip border-b border-dotted border-gray-700">
      <div className="col-span-4 flex h-10 w-full items-center rounded-sm hover:bg-gray-300/10">
        <p className="px-3 font-inter text-xs tracking-tighter">{vip.name}</p>
      </div>
      <div className="col-span-5 flex h-10 w-full items-center px-3 hover:bg-gray-300/10">
        <p className="font-inter text-xs font-medium tracking-tighter text-vanilla">
          {vip.email}
        </p>
      </div>
      <div className="col-span-2 flex h-10 w-full items-center px-4 hover:bg-gray-300/10">
        <p className="flex size-6 items-center justify-center rounded-lg bg-gray-300/10 text-center font-sans text-xs font-semibold tracking-tight text-cake">
          {vip.ticket_count}
        </p>
      </div>
      <div className="col-span-1 flex h-10 w-full items-center justify-center hover:bg-gray-300/10">
        <Checkbox
          color="primary"
          classNames={{
            icon: "text-teal-500",
            wrapper: "border border-gray-600",
          }}
          onChange={handleChangeSelected(vip.email)}
        />
      </div>
    </div>
  );
};

const VIPItem = (field: VIPField) => {
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
              icon="Minus"
              onClick={handlePress(-1)}
              bg="text-gray-300"
              className="size-5"
            />
            <ButtonIcon
              icon="Plus"
              onClick={handlePress(1)}
              bg="text-gray-300"
              className="size-5"
            />
          </div>
        ) : null
      }
    />
  );
};
const VIPBlock = ({ data, icon, label, delay = 0 }: VIPBlockProps) => (
  <div className="h-5/6 w-full space-y-6 border-primary bg-primary p-6 md:border-[0.33px]">
    <BlockHeader label={label} icon={icon} />
    <section className="h-fit rounded bg-gray-400/10 px-4 py-3 text-justify text-tiny text-cake md:p-4 md:text-sm">
      Fill out the name, email of the VIP and add the number of tickets. You can
      add multiple VIPs by clicking the{" "}
      <strong className="text-vanilla">Add</strong> button. You can reduce the
      number of tickets given by entering a negative value.
    </section>
    <HyperList
      data={data}
      container="space-y-6"
      itemStyle="whitespace-nowrap"
      component={VIPItem}
      delay={delay}
      keyId="name"
    />
  </div>
);
