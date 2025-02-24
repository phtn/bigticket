import { ConvexCtx } from "@/app/ctx/convex";
import { onSuccess } from "@/app/ctx/toast";
import { type XEvent } from "@/app/types";
import { type IconName } from "@/icons";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err } from "@/utils/helpers";
import { Checkbox, CheckboxGroup, Form, Input } from "@nextui-org/react";
import type { Cohost, CohostClearance } from "convex/events/d";
import moment from "moment";
import {
  type ChangeEvent,
  use,
  useActionState,
  useCallback,
  useMemo,
  useState,
} from "react";
import { inputClassNames } from "../../editor";
import { BlockHeader } from "./components";
import { cohost_info, type CohostField, CohostZod } from "./schema";

interface CohostBlockProps {
  data: CohostField[];
  label: string;
  icon: IconName;
  delay?: number;
}
interface CohostContentProps {
  xEvent: XEvent | null;
  user_id: string | null;
}

export const HostSettings = ({ xEvent, user_id }: CohostContentProps) => {
  const [clearanceValues, setClearanceValues] = useState<CohostClearance>({
    scan_code: true,
    add_vip: false,
    view_guest_list: false,
  });
  const [cohostList, setCohostList] = useState<Cohost[]>([]);

  const initialState: Cohost = useMemo(
    () => ({
      name: "",
      email: "",
    }),
    [],
  );

  const defaults = useMemo(
    () => ({
      checked: false,
      invitation_sent: false,
    }),
    [],
  );

  const { events } = use(ConvexCtx)!;

  const updateCohostList = useCallback(
    async (data: Cohost) => {
      if (!xEvent?.event_id) return;
      setCohostList((prev) => [...prev, data]);
      return await events.update.coHost(xEvent?.event_id, data);
    },
    [xEvent?.event_id, events.update],
  );

  const addCohost = useCallback(
    async (initialState: Cohost | undefined, fd: FormData) => {
      const cohost = CohostZod.safeParse({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
      });

      if (cohost.error) {
        console.log(cohost.error);
        return;
      }
      await updateCohostList({
        ...defaults,
        ...cohost.data,
        created_by: user_id,
        updated_at: Date.now(),
        clearance: clearanceValues,
      })
        .then(() => {
          onSuccess("Added Co-host");
        })
        .catch(Err);
      return {
        ...cohost.data,
      };
    },
    [updateCohostList, user_id, clearanceValues, defaults],
  );

  const [, action, pending] = useActionState(addCohost, initialState);

  const handleAccessValuesChange = useCallback(
    (values: string[]) => {
      const updatedClearance = updateProps(
        clearanceValues,
        values ?? [],
      ) as CohostClearance;
      console.table(updatedClearance);
      setClearanceValues(updatedClearance);
    },
    [clearanceValues],
  );

  return (
    <Form action={action}>
      <div className="grid h-full w-full grid-cols-1 md:grid-cols-5 md:gap-0 md:rounded">
        <section className="col-span-2 h-fit border-b border-vanilla/20 bg-primary md:h-fit md:border">
          <CohostBlock
            data={cohost_info}
            label="Host Settings"
            icon="UserSettings2"
          />

          <div className="flex h-fit w-full border-t border-vanilla/20 bg-chalk/10 px-6 py-8 md:px-8">
            <CheckboxGroup
              onValueChange={handleAccessValuesChange}
              defaultValue={["scan_code"]}
              label="Select Access clearances"
              orientation="horizontal"
              color="primary"
              description="Choose co-host access clearances for this event."
              classNames={{
                label:
                  "text-white pb-4 font-bold text-lg font-inter tracking-tighter",
                description: "text-chalk/60 text-xs pt-4",
              }}
            >
              <HyperList
                data={Object.entries(clearanceValues).map((c) => c)}
                component={ClearanceItem}
                container="flex space-x-6"
                itemStyle="py-1.5 ps-1.5 pe-2 overflow-hidden rounded-xl hover:bg-primary/35 border-1 border-primary/0 hover:border-chalk/20"
              />
            </CheckboxGroup>
          </div>

          <div className="flex h-1/6 w-full items-end justify-between bg-primary">
            <div className="flex w-full items-center border-t border-vanilla/20 text-chalk">
              <div className="flex h-10 w-full items-center gap-3 border-r border-vanilla/20 px-3">
                <p className="text-sm font-medium text-peach">0</p>
                <p className="font-inter text-xs font-semibold tracking-tight">
                  Confirmed
                </p>
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

        <section className="relative border-vanilla/20 bg-primary text-chalk md:col-span-3 md:border-y md:border-r">
          <div className="h-96 w-full overflow-hidden overflow-y-scroll">
            <div className="flex h-11 w-full items-center justify-between border-b border-vanilla/20 px-3 font-inter text-tiny font-bold">
              <div className="flex items-center gap-4">
                <span>Co-host List</span>
                <span className="font-normal">
                  {xEvent?.cohost_list?.length ?? cohostList.length}
                </span>
              </div>
            </div>
            <HyperList
              data={xEvent?.cohost_list ?? cohostList}
              component={CohostListItem}
              container=""
              keyId="email"
            />
          </div>
          <div className="absolute bottom-2 right-2">
            {/* <Hyper cohost_list={xEvent?.cohost_list} /> */}
          </div>
        </section>
      </div>
    </Form>
  );
};

const CohostListItem = (cohost: Cohost) => {
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
    <div className="grid w-full grid-cols-12 overflow-clip border-b border-dotted border-vanilla/20">
      <div className="col-span-4 flex h-10 w-full items-center rounded-sm hover:bg-gray-300/10">
        <p className="px-3 font-inter text-xs font-semibold tracking-tight">
          {cohost.name}
        </p>
      </div>
      <div className="col-span-5 flex h-10 w-full items-center px-3 hover:bg-gray-300/10">
        <p className="font-inter text-xs font-semibold tracking-tight">
          {cohost.email}
        </p>
      </div>
      <div className="col-span-2 flex h-10 w-full items-center px-3 hover:bg-gray-300/10">
        <p className="font-inter text-xs font-semibold tracking-tight">
          {moment(cohost.updated_at).fromNow()}
        </p>
      </div>
      {/* <div className="col-span-2 flex h-10 w-full items-center px-4 hover:bg-gray-300/10">
        {cohost.clearance?.map((clearance, i) => (
          <p
            key={i}
            className="w-full text-center font-inter text-xs font-semibold tracking-tight"
          >
            {clearance.scan_code ? "OK" : "NOPE"}
          </p>
        ))}
      </div> */}
      <div className="col-span-1 flex h-10 w-full items-center justify-center hover:bg-gray-300/10">
        <Checkbox
          color="primary"
          className="border-0 bg-transparent"
          classNames={{
            icon: "text-teal-500",
            wrapper: "bg-transparent",
          }}
          onChange={handleChangeSelected(cohost.email)}
        />
      </div>
    </div>
  );
};

const CohostItem = (field: CohostField) => {
  return field.name === "clearance" ? (
    field.value
  ) : (
    <Input
      label={field.label}
      name={field.name}
      type={field.type}
      classNames={inputClassNames}
      placeholder={field.placeholder}
      isRequired={field.required}
      defaultValue={field.defaultValue}
      validationBehavior="native"
      className="appearance-none"
    />
  );
};
const CohostBlock = ({ data, icon, label, delay = 0 }: CohostBlockProps) => (
  <div className="mb-8 h-5/6 w-full space-y-6 border-primary bg-primary p-6 md:border-[0.33px]">
    <BlockHeader label={label} icon={icon} />
    <section className="h-fit rounded bg-gray-400/10 px-4 py-3 text-justify text-tiny text-vanilla md:p-4 md:text-sm">
      Fill out the name, email of the Cohost and add access clearances. You can
      add multiple co-hosts for this event.
    </section>
    <HyperList
      data={data}
      container="space-y-6"
      itemStyle="whitespace-nowrap"
      component={CohostItem}
      delay={delay}
      keyId="name"
    />
  </div>
);

const ClearanceItem = (props: [string, boolean]) => {
  return (
    <Checkbox
      className="data-[selected=true]:bg-primary/30"
      classNames={{
        label: "text-chalk capitalize text-sm tracking-tighter font-medium",
        icon: "stroke-2 size-5 text-teal-400",
      }}
      value={props[0]}
    >
      {props[0].replaceAll("_", " ")}
    </Checkbox>
  );
};

function updateProps<T extends object>(data: T, keys: string[]) {
  const obj = {} as Record<keyof T, boolean>;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      obj[key] = keys.includes(key);
    }
  }
  return obj;
}

export function updateBooleanValues<T extends object>(
  data: T[],
  keys: string[],
) {
  return data.map((obj) => {
    const newObj = {} as Record<keyof T, boolean>;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = keys.includes(key);
      }
    }
    return newObj;
  });
}
