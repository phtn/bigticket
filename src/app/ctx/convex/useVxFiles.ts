import { api } from "@vx/api";
import { useMutation } from "convex/react";
import { useCallback } from "react";

export const useVxFiles = () => {
  const generate = useMutation(api.files.create.url);
  const get = useMutation(api.files.get.url);

  const create = useCallback(
    async (file?: File) => {
      if (!file) return null;
      const postUrl = await generate();
      const response = await fetch(postUrl, {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": file?.type ?? "image/*",
        },
      });
      if (!response.ok) throw new Error("Failed to create file");
      const data = (await response.json()) as Promise<{ storageId: string }>;
      return (await data).storageId;
    },
    [generate],
  );

  const getUrl = useCallback(
    async (storageId: string | undefined) => {
      if (!storageId) return null;
      return await get({ storageId });
    },
    [get],
  );

  const mut = {
    create,
    getUrl,
  };

  return { ...mut };
};

export type VxFiles = ReturnType<typeof useVxFiles>;
