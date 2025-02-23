export const q = <T>(arg: T | undefined) => (arg as T) ?? ("skip" as T);
