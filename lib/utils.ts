import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ISODateString = string & { readonly __isoDateStringBrand: true };

type Primitive = string | number | boolean | null | undefined;

export type Serialized<T> = T extends Date
  ? ISODateString | string
  : T extends Primitive
    ? T
    : T extends readonly (infer U)[]
      ? Serialized<U>[]
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : never;

export function toISODateString(value: Date): ISODateString {
  return value.toISOString() as ISODateString;
}

export function fromISODateString(value: ISODateString | string): Date {
  return new Date(value);
}

// AI Slop
export type Option<T> = T | null;
export const None: null = null;
export const Some = <T>(x: T): Option<T> => x;

export const isSome = <T>(o: Option<T>): o is T => o !== null;
export const map = <T, U>(o: Option<T>, f: (x: T) => U): Option<U> =>
  o === null ? null : f(o);
export const andThen = <T, U>(
  o: Option<T>,
  f: (x: T) => Option<U>,
): Option<U> => (o === null ? null : f(o));
export const unwrapOr = <T>(o: Option<T>, d: T): T => (o === null ? d : o);
export const unwrap = <T>(o: Option<T>): T => {
  if (o === null) throw "Error";
  return o;
};

/**
 * NOTE: This documentation is AI Generated.
 *
 * WARN: If you give a string that looks like a number 
 * (specifically the numbers of ms since unix birth), we will not parse it.
 *
 * Parses a timestamp-like input into a valid `Date`.
 *
 * Happy-path inputs:
 * - `Date`: returned directly if valid.
 * - `number`: treated as Unix epoch milliseconds (same semantics as
`new Date(ms)`).
 * - `string`: must be parseable by the JS `Date` constructor; prefer
ISO-8601
 *   (e.g. `"2026-02-19T18:45:00.000Z"`).
 *
 * Notes:
 * - Unix epoch seconds are not accepted directly; convert first with
`seconds * 1000`.
 * - Returns `null` for `null`, unsupported types, or invalid/
unparseable date values.
*/
export function parseTimestamp(timestamp: unknown): Date | null {
  if (
    timestamp === null ||
    (!(timestamp instanceof Date) &&
      typeof timestamp !== "number" &&
      typeof timestamp !== "string")
  ) {
    return null;
  }
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function happenedSameYear(ts1: Date, ts2: Date): boolean {
  return ts1.getFullYear() == ts2.getFullYear();
}

function happenedSameMonth(ts1: Date, ts2: Date): boolean {
  return happenedSameYear(ts1, ts2) && ts1.getMonth() == ts2.getMonth();
}
export function happenedSameDay(ts1: Date, ts2: Date): boolean {
  return happenedSameMonth(ts1, ts2) && ts1.getDate() == ts2.getDate();
}
