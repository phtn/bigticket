import { Icon, type IconName } from "@/icons";

interface SectionTitleProps {
  title: string;
  icon?: IconName;
}

export const SectionTitle = ({ title, icon }: SectionTitleProps) => {
  return (
    <div className="flex h-20 items-end justify-between px-4 pb-4">
      <h2 className="flex items-center gap-2">
        {icon && <Icon name={icon} className="size-5 opacity-60" />}
        <span className="font-inter text-lg font-semibold tracking-tighter">
          {title}
        </span>
      </h2>
      <div className="flex items-center gap-4">
        {/* <SendInvite /> */}
        {/* <SendTicket /> */}
      </div>
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
        <span className="font-inter font-bold tracking-tighter md:text-lg">
          {label}
        </span>
      </div>
      {editMode ? (
        <div className="flex items-center whitespace-nowrap text-xs font-semibold tracking-tight text-macd-blue">
          <div className="flex gap-1 rounded-lg border-2 border-macd-blue bg-macd-blue px-2 py-1.5">
            <Icon name="Pen" className="size-3.5 text-chalk" />
            <span className="text-chalk">Edit Mode</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
