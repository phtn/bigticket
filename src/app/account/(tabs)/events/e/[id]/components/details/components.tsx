import { Icon, type IconName } from "@/icons";

interface SectionTitleProps {
  title: string;
  icon?: IconName;
}

export const SectionTitle = ({ title, icon }: SectionTitleProps) => {
  return (
    <div className="flex h-24 items-end justify-between px-4 pb-8">
      <h2 className="flex items-center gap-2">
        {icon && <Icon name={icon} className="size-5 opacity-60" />}
        <span className="font-inter text-lg font-semibold tracking-tighter">
          {title}
        </span>
      </h2>
      <div className="flex items-center gap-4"></div>
    </div>
  );
};

interface BlockHeaderProps {
  icon: IconName;
  label: string;
  editMode?: boolean;
}

export const BlockHeader = ({
  icon,
  label,
  editMode = false,
}: BlockHeaderProps) => {
  return (
    <div className="flex h-8 w-full items-center justify-between text-sm capitalize text-chalk">
      <div className="flex w-full items-center gap-3">
        <Icon name={icon} className="size-5 opacity-80" />
        <span className="font-inter text-lg font-bold tracking-tighter">
          {label}
        </span>
      </div>
      {editMode ? (
        <div className="flex items-center whitespace-nowrap text-xs font-semibold tracking-tight text-macd-blue">
          <div className="flex gap-1 rounded-sm border-2 border-macd-blue bg-macd-blue px-1.5 py-1">
            <span className="text-chalk">Edit Mode</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
