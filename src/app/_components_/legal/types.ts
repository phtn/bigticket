export interface Section {
  keyId: number;
  id: string;
  title: string;
  content: string;
}

export interface ContentProps {
  company: string;
  important_message: string;
  sections: Section[];
  footer: FooterProps;
  title: string;
}

export interface BodyProps {
  sections: Section[];
  message: string;
}

export interface HeaderProps {
  title: string;
  company: string;
  toggle: VoidFunction;
}

export interface ImportantMessageProps {
  message: string;
}

export interface FooterProps {
  company?: string;
  label: string;
  href: string;
  last_updated?: number;
}

export interface TocProps {
  sections: Section[];
  isOpen: boolean;
  toggleFn: VoidFunction;
  footer: FooterProps;
}
