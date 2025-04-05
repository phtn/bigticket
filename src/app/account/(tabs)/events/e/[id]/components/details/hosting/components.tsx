import { Iconx } from "@/icons";
import { HyperList } from "@/ui/list";
import { Checkbox, CheckboxGroup, Input } from "@nextui-org/react";
import { inputClassNames } from "../../../editor";
import { type CohostField } from "../schema";
import { getCheckedKeys } from "../utils";
import type { ClearancesProps, CohostListProps } from "./types";
import { cn } from "@/lib/utils";
import { type IconName } from "@/icons/types";
import { type ClassName } from "@/app/types";

export const CohostList = ({ cohostList, children }: CohostListProps) => {
  return (
    <section className="relative rounded-lg border border-macl-gray text-chalk md:col-span-3">
      <div className="min-h-96 w-full overflow-hidden overflow-y-scroll">
        <ListHeader count={cohostList.length} />
        {children}
      </div>
    </section>
  );
};

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
        icon: "stroke-2 size-5 text-white",
        wrapper: "",
      }}
      value={props[0]}
    >
      <div className="flex w-full">{props[0].replaceAll("_", " ")}</div>
    </Checkbox>
  );
};

export const Clearances = ({ onChangeFn, values }: ClearancesProps) => {
  return (
    <div className="flex h-fit w-full border-t-[0.33px] border-vanilla/20 px-6 py-8 backdrop-blur-sm lg:px-4 xl:px-6">
      <CheckboxGroup
        onValueChange={onChangeFn}
        value={getCheckedKeys(values)}
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
          data={Object.entries(values).map((c) => c)}
          component={ClearanceItem}
          container="flex flex-col lg:flex-row xl:space-x-5 lg:space-x-2 whitespace-nowrap space-y-2 lg:space-y-0 w-full justify-between xl:justify-start"
          itemStyle="xl:py-1.5 ps-1.5 pe-2 border-0 lg:w-fit w-full overflow-hidden rounded-xl hover:bg-primary/35 hover:border-chalk/20"
        />
      </CheckboxGroup>
    </div>
  );
};

export const FieldItem = (field: CohostField) => (
  <Input
    key={field.name}
    id={field.name}
    label={field.label}
    name={field.name}
    type={field.type}
    onChange={field.onChange}
    classNames={inputClassNames}
    placeholder={field.placeholder}
    isRequired={field.required}
    value={field.value}
    validationBehavior="native"
    className="appearance-none"
  />
);

export const ListHeader = ({ count }: { count?: number }) => {
  return (
    <div className="flex h-14 w-full items-center justify-between border-b border-macl-gray/60 px-2 font-inter text-tiny font-bold md:h-16 md:px-4">
      <div className="flex w-full items-center justify-between font-normal">
        <div className="flex items-center">
          <div className="flex items-center gap-4 text-lg font-semibold">
            <span className="font-sans tracking-tight text-primary">
              Co-hosts
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-macd-gray/10 font-sans font-semibold text-primary">
              {count ?? <Iconx name="spinners-bouncing-ball" />}
            </div>
          </div>
        </div>
        <div className="flex items-center text-chalk">
          <div className="flex w-12 items-center justify-end">
            <Iconx name="key" className="text-primary/80" />
          </div>
          <div className="flex w-14 items-center justify-end text-xs md:w-24 md:justify-end">
            <Iconx name="mail-send" className="text-primary/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Reference = () => {
  const reference_items = [
    { icon: "key", label: "Access Clearances" },
    { icon: "mail-send", label: "Invitation Sent Status" },
    { icon: "mail-not-sent", label: "Not Sent" },
    {
      icon: "mail-sent",
      label: "Email Sent",
      style:
        "text-macl-blue bg-gradient-to-b from-blue-400/15 via-sky-300/10 to-transparent",
    },
    {
      icon: "mail-received",
      label: "Invitation Received & Confirmed",
      style:
        "text-teal-600 bg-gradient-to-b from-teal-400/15 via-teal-300/10 to-transparent",
    },
  ] as LegendItemProps[];

  const access_items = [
    { style: "bg-warning", label: "Add VIP" },
    { style: "bg-secondary", label: "Scan Code" },
    { style: "bg-danger", label: "View Guest List" },
  ] as LegendItemProps[];

  return (
    <div className="rounded-lg border border-macd-gray/80 bg-gray-100/80 p-6">
      <div className="text-normal">
        <span className="text-[16px] tracking-tight">References:</span>
      </div>

      <HyperList
        data={reference_items}
        component={LegendItem}
        container="pt-6"
      />
      <HyperList data={access_items} component={AccessItem} container="pb-6" />
    </div>
  );
};

interface LegendItemProps {
  icon: IconName;
  label: string;
  style?: ClassName;
}

const LegendItem = ({ icon, label, style }: LegendItemProps) => {
  return (
    <div className="flex items-center space-x-3 py-2">
      <Iconx
        name={icon}
        className={cn("size-5 rounded-lg text-primary/80", style)}
      />
      <span>{label}</span>
    </div>
  );
};

interface AccessItemProps {
  style?: ClassName;
  label: string;
}
const AccessItem = ({ label, style }: AccessItemProps) => {
  return (
    <div className="flex items-center space-x-3 py-2">
      <span className={cn("size-5 rounded-md", style)}></span>
      <span>{label}</span>
    </div>
  );
};
