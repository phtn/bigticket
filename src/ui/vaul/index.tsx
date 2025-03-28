import type { ClassName } from "@/app/types";
import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactNode } from "react";
import { type DialogProps, Drawer } from "vaul";

interface ComponentProps {
  children: ReactNode;
  title?: string;
  description?: string;
}
const Component = ({
  children,
  title,
  description,
  ...props
}: ComponentProps & DialogProps) => {
  return (
    <Drawer.Root {...props}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0" />
        <Drawer.Content className="fixed bottom-10 right-0 top-16 z-[100] flex h-fit w-fit flex-col bg-transparent outline-none">
          <Drawer.Title className="hidden">{title}</Drawer.Title>
          <Drawer.Description className="hidden">
            {description}
          </Drawer.Description>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const BottomComponent = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  dismissible = false,
}: ComponentProps & DialogProps) => {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      direction={"bottom"}
      dismissible={dismissible}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-ticket/20" />
        <Drawer.Content className="fixed bottom-0 right-0 z-[100] flex h-fit w-fit flex-col rounded-t-[2.5rem] border-x border-t-2 border-macl-gray bg-gradient-to-t from-gray-100 to-white pt-4 outline-none">
          <Drawer.Handle />
          <Drawer.Title className="hidden">{title}</Drawer.Title>
          <Drawer.Description className="hidden">
            {description}
          </Drawer.Description>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

interface HandleProps {
  close: VoidFunction;
  className?: ClassName;
}

const Handle = ({ close, className }: HandleProps) => (
  <div
    onClick={close}
    className={cn(
      "my-1 h-1.5 w-4 flex-shrink-0 cursor-pointer rounded-full bg-amber-600 transition-colors duration-300 ease-in hover:bg-warning",
      className,
    )}
  />
);

const Body = ({ children }: PropsWithChildren) => (
  <div className="dark:bg-steel flex w-full items-start justify-between overflow-hidden border-[0.33px] bg-chalk text-foreground">
    {children}
  </div>
);

const Footer = ({ children }: PropsWithChildren) => (
  <div className="border-steel w-full rounded-b-md border-t-[0.5px] bg-primary/30 p-2 backdrop-blur-lg">
    <div className="mx-auto flex items-center justify-between">{children}</div>
  </div>
);

const FloatingComponent = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  ...props
}: ComponentProps & DialogProps) => {
  return (
    <Drawer.Root
      {...props}
      modal={false}
      open={open}
      onOpenChange={onOpenChange}
      direction={"bottom"}
    >
      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-0 right-0 z-[100] flex h-72 flex-col items-center justify-center bg-white/10 outline-none md:w-[30rem] xl:w-[30rem] portrait:w-full">
          <Handle
            close={() => !open}
            className="w-12 border-peach bg-peach text-peach"
          />
          <Drawer.Title className="hidden">{title}</Drawer.Title>
          <Drawer.Description className="hidden">
            {description}
          </Drawer.Description>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

type TSideVaul = typeof Component & {
  Handle: typeof Handle;
  Body: typeof Body;
  Footer: typeof Footer;
};

const SideVaul: TSideVaul = Object.assign(Component, {
  Handle,
  Body,
  Footer,
});
const BottomVaul: TSideVaul = Object.assign(BottomComponent, {
  Handle,
  Body,
  Footer,
});
const FloatingVaul: TSideVaul = Object.assign(FloatingComponent, {
  Handle,
  Body,
  Footer,
});
export { BottomVaul, FloatingVaul, SideVaul };
