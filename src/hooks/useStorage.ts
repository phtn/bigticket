"use client";

import { useEffect, useState } from "react";

export const useStorage = <T>(key: string) => {
  const [item, getItem] = useState<T | null>(null);

  const setItem = (data: T) => {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const serialized = localStorage.getItem(key);
      getItem(serialized ? (JSON.parse(serialized) as T) : null);
    }
  }, [key]);

  const rmItem = () => {
    localStorage.removeItem(key);
  };

  return { setItem, item, rmItem };
};
