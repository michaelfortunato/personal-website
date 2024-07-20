import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Err, Ok, Result } from "ts-results-es";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function unwrap(value?: any, errorMessage?: any) {
  if (value === null || value === undefined) {
    throw new Error(errorMessage || "Missing value");
  } else {
    return value;
  }
}

export async function tryAsync<T, E = Error>(
  op: () => Promise<T>,
): Promise<Result<T, E>> {
  try {
    return new Ok((await op()) as T);
  } catch (e) {
    return new Err(e as E);
  }
}

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
