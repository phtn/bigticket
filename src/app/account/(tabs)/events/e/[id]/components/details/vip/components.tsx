import { Iconx } from "@/icons";

export const ListHeader = ({ count }: { count?: number }) => {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b-3 border-vanilla/20 px-4 font-inter text-tiny font-bold md:h-20">
      <div className="flex w-full items-center justify-between font-normal">
        <div className="flex items-center">
          <div className="flex items-center gap-4 text-lg font-semibold">
            <span className="font-sans tracking-tight text-vanilla">
              Guests
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-vanilla/5 font-sans font-semibold text-vanilla">
              {count ?? <Iconx name="spinners-bouncing-ball" />}
            </div>
          </div>
        </div>
        <div className="flex items-center text-chalk">
          <div className="flex w-14 items-center justify-center gap-1 md:w-20">
            <Iconx name="ticket-horizontal" className="text-vanilla" />
          </div>
          <div className="flex w-14 items-center justify-center gap-1 text-xs md:w-28 md:justify-end">
            <Iconx name="mail-send" className="text-vanilla" />
          </div>
        </div>
      </div>
    </div>
  );
};
