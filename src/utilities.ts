import { Primitive as ZodPrimitive } from "zod";
import { RemoveNull } from "./typeUtilities";

type InternalKey = `_${string}`;

type Primitive = Exclude<ZodPrimitive, symbol>;

export type PickPrimitiveObjectProperties<
  T,
  TValue extends false | unknown = false
> = {
  [K in keyof T as T[K] extends Exclude<Primitive, symbol>
    ? Exclude<K, InternalKey>
    : never]: TValue extends false ? T[K] : TValue;
};

type PickResult<T extends object, P extends object> = Pick<
  T,
  Extract<keyof P, keyof T>
>;

/**
 * Picks only properties with primitive values
 * Picks only properties with primitive values from an object and returns a new object with those properties.
 *
 * @returns A new object containing only the properties with primitive values.
 *
 */
export function pickPrimitiveObjectProperties<
  T extends object,
  TPick extends Partial<PickPrimitiveObjectProperties<T, true>>,
  TObj extends PickPrimitiveObjectProperties<T> = PickPrimitiveObjectProperties<T>,
  TResult extends RemoveNull<PickResult<TObj, TPick>> = RemoveNull<
    PickResult<TObj, TPick>
  >
>(obj: T, pick: TPick): TResult {
  return Object.entries(pick).reduce((result, [key]) => {
    const value = obj[key as keyof typeof obj];
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint" ||
      value === undefined
    ) {
      (result as any)[key] = value;
    }
    return result;
  }, {} as Pick<TObj, Extract<keyof TPick, keyof TObj>>) as TResult;
}
