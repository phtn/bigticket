"use client";

import { useCallback, useEffect, useState } from "react";

interface StorageItem<T> {
  key: string;
  data: T;
}

interface StorageError {
  key: string;
  error: Error;
}

/**
 * Hook for managing multiple localStorage items with type safety
 */
export const useLocal = <T extends object>(items: StorageItem<T>[]) => {
  const [storage, setStorage] = useState<Record<string, T | null>>({});
  const [errors, setErrors] = useState<StorageError[]>([]);

  // Get item from localStorage
  const getItem = useCallback((key: string) => {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized) {
        return JSON.parse(serialized) as T;
      }
      return null;
    } catch (err) {
      setErrors(prev => [...prev, {
        key,
        error: err instanceof Error ? err : new Error("Failed to parse stored item")
      }]);
      return null;
    }
  }, []);

  // Set item in localStorage
  const updateItem = useCallback((key: string, data: T) => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      setStorage(prev => ({ ...prev, [key]: data }));
    } catch (err) {
      setErrors(prev => [...prev, {
        key,
        error: err instanceof Error ? err : new Error("Failed to store item")
      }]);
    }
  }, []);

  // Remove item from localStorage
  const removeItem = useCallback((key: string) => {
    try {
      localStorage.removeItem(key);
      setStorage(prev => ({ ...prev, [key]: null }));
    } catch (err) {
      setErrors(prev => [...prev, {
        key,
        error: err instanceof Error ? err : new Error("Failed to remove item")
      }]);
    }
  }, []);

  // Initialize state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialStorage: Record<string, T | null> = {};
      items.forEach(({ key }) => {
        initialStorage[key] = getItem(key);
      });
      setStorage(initialStorage);
    }
  }, [items, getItem]);

  return {
    storage,
    errors,
    getItem,
    setItem: updateItem,
    removeItem,
    clearErrors: () => setErrors([]),
  } as const;
};

// Type exports
export type LocalStorage<T extends object> = ReturnType<typeof useLocal<T>>;
export type { StorageItem, StorageError };
