export const q = <T>(arg: T | undefined) => (arg as T) ?? ("skip" as T);
export const qs = <T>(arg: (T | undefined)[]) => (arg as T[]) ?? ("skip" as T);
