import crypto from "crypto";

export function secureRef(length: number) {
  const byteLength = Math.ceil(length / 2); // Calculate required bytes
  const randomBytes = crypto.randomBytes(byteLength);
  const randomString = randomBytes.toString("hex").slice(0, length); // Convert to hex and truncate
  return randomString;
}

export function moses(str: string) {
  const middleIndex = Math.floor(str.length / 2);
  const firstHalf = str.substring(0, middleIndex);
  const secondHalf = str.substring(middleIndex);
  return firstHalf + "-" + secondHalf;
}
