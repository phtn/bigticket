import { useConvexCtx } from "@/app/ctx/convex";
import { onSuccess } from "@/app/ctx/toast";
import { Icon } from "@/icons";
import { Hyper } from "@/ui/button/button";
import { HyperList } from "@/ui/list";
import { Err, getInitials } from "@/utils/helpers";
import { Checkbox, CheckboxGroup, Form, Input, User } from "@nextui-org/react";
import type { Cohost, CohostClearance } from "convex/events/d";
import {
  startTransition,
  useActionState,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from "react";
import { inputClassNames } from "../../../editor";
import { BlockHeader } from "../components";
import { type CohostField, CohostZod } from "../schema";
import { Nebula } from "../";
import { useConvexUtils } from "@/app/ctx/convex/useConvexUtils";
import { cn } from "@/lib/utils";
import { cohostReducer, initialCohostState } from "./reducer";
import type {
  CohostBlockProps,
  CohostContentProps,
  CohostWithDefaults,
} from "./types";

export const HostSettings = ({ xEvent, user_id }: CohostContentProps) => {
  const [state, dispatch] = useReducer(cohostReducer, {
    ...initialCohostState,
    cohostList: [] as CohostWithDefaults[],
  });

  const { cohostList, selectedCohost } = state;

  const [clearanceValues, setClearanceValues] = useState<CohostClearance>({
    scan_code: true,
    add_vip: false,
    view_guest_list: false,
  });

  const initialState: Cohost = useMemo(
    () => ({
      name: selectedCohost?.name ?? "",
      email: selectedCohost?.email ?? "",
    }),
    [selectedCohost],
  );

  const defaults = useMemo(
    () => ({
      checked: false,
      invitation_sent: false,
    }),
    [],
  );

  const { vxEvents } = useConvexCtx();
  const { q } = useConvexUtils();

  const updateCohostList = useCallback(
    async (data: Cohost) => {
      if (!xEvent?.event_id) return;
      dispatch({ type: "UPDATE_COHOST", payload: data });
      return await vxEvents.mut.updateEventCohost({
        id: q(xEvent?.event_id),
        cohost: data,
      });
    },
    [xEvent?.event_id, vxEvents.mut, q],
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
        event_id: xEvent?.event_id,
        event_name: xEvent?.event_name,
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
    [
      updateCohostList,
      user_id,
      clearanceValues,
      defaults,
      xEvent?.event_id,
      xEvent?.event_name,
    ],
  );

  const [, action, pending] = useActionState(addCohost, initialState);

  const handleAccessValuesChange = useCallback(
    (values: string[]) => {
      const updatedClearance = updateProps(
        clearanceValues,
        values ?? [],
      ) as CohostClearance;
      // console.table(updatedClearance);
      setClearanceValues(updatedClearance);
    },
    [clearanceValues],
  );

  const handleUserSelect = useCallback((email: string, isSelected: boolean) => {
    startTransition(() => {
      dispatch({
        type: "SELECT_COHOST",
        payload: { email, isSelected },
      });
    });
  }, []);

  const RowItem = useCallback(
    (cohost: Cohost) => {
      const handleChangeSelected = (isSelected: boolean) => {
        handleUserSelect(cohost.email, isSelected);
      };
      return (
        <Checkbox
          name={cohost.email}
          disableAnimation={false}
          color="secondary"
          classNames={{
            base: cn(
              "flex items-center relative min-w-full justify-between p-4",
              "hover:bg-vanilla/5 rounded-sm cursor-pointer",
            ),
            label: "flex items-center tracking-tight w-full max-w-full",
            icon: "text-primary",
            wrapper: "ml-4",
          }}
          isSelected={cohost.checked}
          onValueChange={handleChangeSelected}
        >
          <div
            className={cn(
              "absolute -left-12 top-0 z-10 font-sans text-[10px] text-vanilla opacity-40",
              { "text-teal-400 opacity-100": cohost.checked },
            )}
          >
            {cohost.idx}
          </div>
          <div className="flex w-full items-center justify-between ps-2 md:ps-0">
            <User
              classNames={{
                name: "whitespace-nowrap font-semibold text-chalk text-xs font-inter",
              }}
              avatarProps={{
                size: "sm",
                fallback: getInitials(cohost.name)?.toUpperCase(),
                className:
                  "text-[16px] hidden overflow-hidden md:flex ml-2 mr-1 bg-macd-orange/50 rounded-md border-vanilla/20 text-vanilla/90 flex-grow-0 font-semibold",
              }}
              description={
                <p className="font-inter text-tiny text-vanilla/80">
                  {cohost.email}
                </p>
              }
              name={cohost.name}
            />
          </div>

          <div className="flex items-center justify-end whitespace-nowrap text-chalk">
            <div className="flex w-14 items-center justify-center gap-[1.5px] text-sm font-medium text-vanilla md:w-20">
              <span className="font-sans">cleareances...</span>
            </div>
            <div
              className={cn(
                "flex w-14 items-center justify-center gap-[1.5px] text-xs font-semibold tracking-tighter text-vanilla/40 md:w-28 md:justify-end",
                {
                  "text-teal-400": cohost.invitation_sent,
                },
              )}
            >
              {cohost.invitation_sent ? "Sent" : "Not Sent"}
              <Icon
                name="Check"
                className={cn("hidden size-2.5", {
                  flex: cohost.invitation_sent,
                })}
              />
            </div>
          </div>
        </Checkbox>
      );
    },
    [handleUserSelect],
  );

  const cohost_info: CohostField[] = useMemo(
    () => [
      {
        name: "name",
        type: "text",
        label: "Name",
        placeholder: "Name of the co-host",
        required: false,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Email receiving the invitation",
        required: true,
      },
    ],
    [],
  );

  return (
    <Nebula>
      <Form action={action}>
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-5 md:gap-0 md:rounded">
          <section className="h-fit border-b border-vanilla/20 sm:col-span-3 md:col-span-2 md:h-fit md:border-[0.33px]">
            <CohostBlock
              data={cohost_info}
              label="Host Settings"
              icon="UserSettings2"
            />

            <div className="flex h-fit w-full border-t-[0.33px] border-vanilla/20 px-6 py-8 backdrop-blur-sm lg:px-4 xl:px-6">
              <CheckboxGroup
                onValueChange={handleAccessValuesChange}
                defaultValue={["scan_code"]}
                label="Select Access clearances"
                orientation="horizontal"
                color="primary"
                description="Choose co-host access clearances for this event."
                className="w-full"
                classNames={{
                  wrapper: "",
                  base: "w-full",
                  label:
                    "text-white pb-4 font-bold w-full text-lg font-inter tracking-tighter",
                  description: "text-chalk/60 text-xs pt-4",
                }}
              >
                <HyperList
                  data={Object.entries(clearanceValues).map((c) => c)}
                  component={ClearanceItem}
                  container="flex flex-col lg:flex-row xl:space-x-5 lg:space-x-2 whitespace-nowrap space-y-2 lg:space-y-0 w-full justify-between xl:justify-start"
                  itemStyle="xl:py-1.5 ps-1.5 pe-2 border-0 lg:w-fit w-full overflow-hidden rounded-xl hover:bg-primary/35 hover:border-chalk/20"
                />
              </CheckboxGroup>
            </div>

            <div className="flex h-1/6 w-full items-end justify-between">
              <div className="flex w-full items-center border-t-[0.33px] border-vanilla/20 text-chalk">
                <div className="flex h-14 w-full items-center justify-between gap-3 border-r-[0.33px] border-vanilla/20 px-3">
                  <p className="font-inter text-xs font-semibold tracking-tight">
                    Confirmed
                  </p>
                  <p className="font-sans text-sm">0</p>
                </div>
                <Hyper
                  disabled={pending}
                  loading={pending}
                  type="submit"
                  label="Add"
                  end="Plus"
                  fullWidth
                  dark
                  xl
                />
              </div>
            </div>
          </section>

          <section className="relative border-vanilla/20 text-chalk md:col-span-3 md:border-y md:border-r">
            <div className="h-96 w-full overflow-hidden overflow-y-scroll">
              <div className="flex h-11 w-full items-center justify-between border-b-3 border-vanilla/20 px-3 font-inter text-tiny font-bold">
                <div className="flex w-full items-center justify-between gap-6 md:justify-start">
                  <span>Co-host List</span>
                  <span className="font-sans font-normal">
                    {xEvent?.cohost_list?.length ?? cohostList.length}
                  </span>
                </div>
              </div>
              <HyperList
                data={xEvent?.cohost_list ?? cohostList}
                component={RowItem}
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
    </Nebula>
  );
};

const CohostFieldItem = (field: CohostField) => {
  return field.name === "clearance" ? (
    field.value
  ) : (
    <Input
      id={field.name}
      label={field.label}
      name={field.name}
      type={field.type}
      autoComplete={field.name}
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
  <div className="mb-8 h-5/6 w-full space-y-6 p-6">
    <BlockHeader label={label} icon={icon} />
    <section className="-mx-6 h-fit rounded-sm bg-teal-300/20 px-4 py-3 text-justify text-tiny text-vanilla md:p-4 md:text-sm">
      You can add co-hosts and event marshals to assist you with ticket-scanning
      and other guest verification during the event. Fill out the name and
      email, select access clearances, then click add. You can add multiple
      co-hosts for this event.
    </section>
    <HyperList
      data={data}
      container="space-y-8"
      itemStyle="whitespace-nowrap"
      component={CohostFieldItem}
      delay={delay}
      keyId="name"
    />
  </div>
);

const ClearanceItem = (props: [string, boolean]) => {
  return (
    <Checkbox
      name={props[0]}
      color={
        props[0] === "scan_code"
          ? "secondary"
          : props[0] === "add_vip"
            ? "warning"
            : "danger"
      }
      className="flex data-[selected=true]:bg-primary/30"
      classNames={{
        base: "flex max-w-lg h-14 md:max-w-none px-3",
        label:
          "text-chalk flex w-full capitalize text-sm tracking-tighter font-medium",
        icon: "stroke-2 size-5 text-primary",
        wrapper: "",
      }}
      value={props[0]}
    >
      <div className="flex w-full">{props[0].replaceAll("_", " ")}</div>
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
