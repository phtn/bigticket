import { Icon, type IconName } from "@/icons";

interface SectionTitleProps {
  title: string;
  icon: IconName;
}

export const SectionTitle = ({ title, icon }: SectionTitleProps) => {
  return (
    <div className="flex h-20 items-end justify-between px-4">
      <h2 className="flex items-center gap-2">
        <Icon name={icon} className="size-5 opacity-60" />
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
}

export const BlockHeader = ({ icon, label }: BlockHeaderProps) => {
  return (
    <div className="flex h-8 items-end gap-3 text-sm text-chalk">
      <Icon name={icon} className="size-5 opacity-80" />
      <span className="font-inter font-bold tracking-tighter">{label}</span>
    </div>
  );
};
