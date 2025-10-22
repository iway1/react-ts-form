import { ZodArray, ZodEnum } from "zod";
import {
  HIDDEN_ID_PROPERTY,
  isSchemaWithHiddenProperties,
} from "./createFieldSchema";
import { RTFSupportedZodTypes } from "./supportedZodTypes";

export type UnwrappedRTFSupportedZodTypes = {
  type: RTFSupportedZodTypes;
  [HIDDEN_ID_PROPERTY]: string | null;
};

export function unwrap(
  type: RTFSupportedZodTypes
): UnwrappedRTFSupportedZodTypes {
  // Realized zod has a built in "unwrap()" function after writing this.
  // Not sure if it's super necessary.
  let r = type;

  let unwrappedHiddenId: null | string = null;
  while ("unwrap" in r && !("element" in r)) {
    if (isSchemaWithHiddenProperties(r)) {
      unwrappedHiddenId = r.def[HIDDEN_ID_PROPERTY];
    }

    r = r.unwrap();
  }

  let innerHiddenId: null | string = null;

  if (isSchemaWithHiddenProperties(r)) {
    innerHiddenId = r.def[HIDDEN_ID_PROPERTY];
  }

  return {
    type: r,
    [HIDDEN_ID_PROPERTY]: innerHiddenId || unwrappedHiddenId,
  };
}

export function unwrapEffects(effects: RTFSupportedZodTypes) {
  return effects;
}

export type UnwrapPreviousLevel = [never, 0, 1, 2, 3];
export type UnwrapMaxRecursionDepth = 3;

/**
 * At most we can see for a given type z.enum().optional().nullable().default("foo")
 * so we limit recursion depth to 3
 * then we can see the same again for the inner type of an array
 * z.enum(["moo"]).optional().nullable().default('moo').array().optional().nullable().default(['moo'])
 * so we restart the counter for array only, leaving us with a max of 6
 * and ts seems ok with this because the type is very simple
 */
export type UnwrapZodType<
  T extends RTFSupportedZodTypes,
  Level extends UnwrapPreviousLevel[number] = UnwrapMaxRecursionDepth
> = [Level] extends [never]
  ? never
  : T extends { unwrap: () => any; element?: never }
  ? UnwrapZodType<ReturnType<T["unwrap"]>, UnwrapPreviousLevel[Level]>
  : T extends ZodArray<any>
  ? // allow another 3 levels of recursion for the array
    ZodArray<UnwrapZodType<T["element"], UnwrapMaxRecursionDepth>>
  : T extends ZodEnum<any>
  ? ZodEnum<any>
  : T;
