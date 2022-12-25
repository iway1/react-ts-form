export type OptionalKeys<T> = {
  [K in keyof NonNullable<T>]-?: {} extends Pick<NonNullable<T>, K> ? K : never;
}[keyof NonNullable<T>];

// if it has a required property, it should be required
// so create a type that takes a partial, and makes any object with required properties required

// NonNullable to support optional types
type RequiredKeys<T> = {
  [K in keyof NonNullable<T>]-?: {} extends Pick<NonNullable<T>, K> ? never : K;
}[keyof NonNullable<T>];
type IsEmpty<T> = T[keyof T] extends never ? true : false;
type HasRequiredKey<T> = IsEmpty<RequiredKeys<T>> extends false ? true : false;
type KeysWithRequiredKeyList<T> = {
  [key in keyof T]-?: HasRequiredKey<T[key]> extends true ? key : never;
}[keyof T];

type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type RequireKeysWithRequiredChildren<T extends Record<string, any>> = T &
  Require<T, KeysWithRequiredKeyList<T>>;

/**
 * Omit that disallows passing an object if the object is empty.
 */
type SafeOmit<T, Key extends keyof T> = IsEmpty<Omit<T, Key>> extends true
  ? never
  : Omit<T, Key>;

export type DistributiveOmit<T, K extends keyof T> = T extends any
  ? SafeOmit<T, K>
  : never;

export type Indexes<V extends readonly any[]> = {
  [K in Exclude<keyof V, keyof Array<any>>]: K;
};
export type IndexOf<V extends readonly any[], T> = {
  [I in keyof Indexes<V>]: V[I] extends T
    ? T extends V[I]
      ? I
      : never
    : never;
}[keyof Indexes<V>];
