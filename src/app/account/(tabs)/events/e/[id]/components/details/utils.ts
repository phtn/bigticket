export const checkedState = <T extends { checked?: boolean }>(list: T[]) => {
  const checked = list.filter((v) => v.checked);
  return {
    checked,
    count: checked.length,
    onEdit: checked.length === 1,
  };
};

export function updateProps<T extends object>(data: T, keys: string[]) {
  const obj = {} as Record<keyof T, boolean>;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      obj[key] = keys.includes(key);
    }
  }
  return obj;
}

export function updateBooleanValues<T extends object>(
  data: T[],
  keys: string[],
) {
  return data.map((obj) => {
    const newObj = {} as Record<keyof T, boolean>;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = keys.includes(key);
      }
    }
    return newObj;
  });
}

export const getCheckedKeys = (obj: Record<string, boolean | undefined>) =>
  Object.entries(obj)
    .filter(([_, value]) => value)
    .map(([key]) => key);
