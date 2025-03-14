import { HyperList } from "@/ui/list";
import { BlockHeader } from "../components";
import { type MediaField } from "../schema";
import { Input } from "@nextui-org/react";
import { inputClassNames } from "../../../editor";
import { type IconName } from "@/icons/types";

interface MediaBlockProps {
  data: MediaField[];
  label: string;
  icon: IconName;
  delay?: number;
}

export const MediaBlock = ({
  data,
  icon,
  label,
  delay = 0,
}: MediaBlockProps) => (
  <div className="h-5/6 w-full space-y-6 p-6">
    <BlockHeader label={label} icon={icon} />
    <section className="h-fit rounded bg-gray-400/10 px-4 py-3 text-justify text-tiny text-vanilla md:p-4 md:text-sm">
      This feature currently works for YouTube videos. You can upload your own
      videos or use videos from YouTube by providing the video ID.
    </section>
    <HyperList
      data={data}
      container="space-y-6"
      itemStyle="whitespace-nowrap"
      component={MediaItem}
      delay={delay}
      keyId="name"
    />
  </div>
);

const MediaItem = (field: MediaField) => {
  return (
    <Input
      id={field.name}
      name={field.name}
      label={field.label}
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
