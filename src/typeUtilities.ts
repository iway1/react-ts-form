import { z } from "zod";
import type { FormComponentMapping } from "./createSchemaForm";
import { RTFBaseZodType, RTFSupportedZodTypes } from "./supportedZodTypes";
import { UnwrapZodType } from "./unwrap";

/**
 * @internal
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * @internal
 */
export type OptionalKeys<T> = {
  [K in keyof NonNullable<T>]-?: {} extends Pick<NonNullable<T>, K> ? K : never;
}[keyof NonNullable<T>];

// NonNullable to support optional types
/**
 * @internal
 */
export type RequiredKeys<T> = {
  [K in keyof NonNullable<T>]-?: {} extends Pick<NonNullable<T>, K> ? never : K;
}[keyof NonNullable<T>];
type IsEmpty<T> = T[keyof T] extends never ? true : false;
type HasRequiredKey<T> = IsEmpty<RequiredKeys<T>> extends false ? true : false;
type KeysWithRequiredKeyList<T> = {
  [key in keyof T]-?: HasRequiredKey<T[key]> extends true ? key : never;
}[keyof T];

/**
 * @internal
 */
export type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * @internal
 */
export type RequireKeysWithRequiredChildren<T extends Record<string, any>> = T &
  Require<T, KeysWithRequiredKeyList<T>>;

/**
 * @internal
 */
export type SafeOmit<T, Key extends keyof T> = IsEmpty<
  Omit<T, Key>
> extends true
  ? never
  : Omit<T, Key>;

/**
 * @internal
 */
export type DistributiveOmit<T, K extends keyof T> = T extends T
  ? // Typescript actually is fine with Omit<T, K>, but this is surprising because
    // K might include elements that are not in every member of the union T. In other words,
    // K does not extend keyof T.
    Omit<T, K & keyof T>
  : never;

/**
 * @internal
 */
export type Indexes<V extends readonly any[]> = {
  [K in Exclude<keyof V, keyof Array<any>>]: K;
};

/**
 * @internal
 */
export type UnwrapZodBrand<T extends RTFBaseZodType> = T extends z.ZodBranded<
  z.ZodTypeAny,
  infer ID
>
  ? ID
  : T;

/**
 * @internal
 */
export type UnwrapMapping<T extends FormComponentMapping> = {
  [Index in keyof T]: T[Index] extends readonly [any, any]
    ? readonly [UnwrapZodBrand<T[Index][0]>, any]
    : never;
};

/**
 * @internal
 */
export type IndexOfUnwrapZodType<T extends RTFSupportedZodTypes> =
  T extends z.ZodBranded<z.ZodTypeAny, infer ID> ? ID : UnwrapZodType<T>;

/**
 * @internal
 */
export type IndexOf<V extends readonly any[], T> = {
  [I in keyof Indexes<V>]: V[I] extends T
    ? T extends V[I]
      ? I
      : never
    : never;
}[keyof Indexes<V>];

/**
 * @internal
 */
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

/**
 * @internal
 */
export type NullToUndefined<T> = T extends null ? undefined : T;

/**
 * @internal
 */
export type RemoveNull<T> = ExpandRecursively<{
  [K in keyof T]: NullToUndefined<T[K]>;
}>;
