export interface PexelParamItem {
  id: string;
  value: string;
  category: string;
  description: string;
}

export interface PexelParams {
  id: number;
  param: "query" | "locale";
  label: string;
  description: string;
  items: PexelParamItem[];
}

export interface QueryData {
  query?: string | undefined;
  locale?: string | undefined;
}
