export const upsert = <T extends Record<K, any>, K extends keyof T>(
  arr: T[],
  item: T,
  keyField: K,
  updateFields: (keyof T)[],
): T[] => {
  const map = new Map();
  arr.forEach((element, index) => map.set(element[keyField], index));

  const existingIndex = map.get(item[keyField]);

  if (existingIndex !== undefined) {
    updateFields.forEach((field) => {
      arr[existingIndex]![field] = item[field];
    });
  } else {
    arr.push(item);
  }

  // Optional: if filtering is needed
  // Return the filtered array based on a condition function
  return arr;
};
