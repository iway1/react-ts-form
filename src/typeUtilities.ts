import { ComponentProps } from "react";
import { AnyZodObject, z, ZodEffects } from "zod";
import {
  ExtraProps,
  FormComponentMapping,
  PropsMapping,
} from "./createSchemaForm";
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

/**
 * @internal
 */
export type IsEmpty<T> = T[keyof T] extends never ? true : false;

/**
 * @internal
 */
export type HasRequiredKey<T> = IsEmpty<RequiredKeys<T>> extends false
  ? true
  : false;

/**
 * @internal
 */
export type UnwrapFn<T> = T extends (...args: any) => infer Ret ? Ret : T;

/**
 * @internal
 */
export type KeysWithRequiredKeyList<T> = {
  [key in keyof T]-?: HasRequiredKey<UnwrapFn<T[key]>> extends true
    ? key
    : never;
}[keyof T];

/**
 * @internal
 */
export type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * @internal
 */
export type Fn = (...args: any) => any;
/**
 * @internal
 */
export type ReturnTypeKeys<T extends Record<string, Fn>> = {
  [key in keyof T]: ReturnType<T[key]>;
};
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
export type DistributiveOmit<T, K extends keyof T> = T extends any
  ? SafeOmit<T, K>
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
export type UnwrapEffects<T extends AnyZodObject | ZodEffects<any, any>> =
  T extends AnyZodObject
    ? T
    : T extends ZodEffects<any, any>
    ? T["_def"]["schema"]
    : never;

type SomeSchema = AnyZodObject | ZodEffects<any, any>;

export type PropsInner<
  Mapping extends FormComponentMapping,
  SchemaType extends SomeSchema,
  PropsMapType extends PropsMapping
> = RequireKeysWithRequiredChildren<
  Partial<{
    [key in keyof z.infer<SchemaType>]: Mapping[IndexOf<
      Mapping,
      readonly [
        UnwrapZodType<
          ReturnType<UnwrapEffects<SchemaType>["_def"]["shape"]>[key]
        >,
        any
      ]
    >] extends readonly [any, any] // I guess this tells typescript it has a second element? errors without this check.
      ? Omit<
          ComponentProps<
            Mapping[IndexOf<
              Mapping,
              readonly [
                UnwrapZodType<
                  ReturnType<UnwrapEffects<SchemaType>["_def"]["shape"]>[key]
                >,
                any
              ]
            >][1]
          >,
          PropsMapType[number][1]
        > &
          ExtraProps
      : never;
  }>
>;
