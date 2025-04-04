import { api } from "@vx/api";
import { useMutation } from "convex/react";

export const useVxLogs = () => {
  const mut = {
    create: useMutation(api.logs.create.default),
  };

  return {
    mut: { ...mut },
  };
};

export type VxLogs = ReturnType<typeof useVxLogs>;
