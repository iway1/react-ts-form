import {
  z,
  ZodArray,
  ZodDefault,
  ZodEnum,
  ZodFirstPartyTypeKind,
  ZodNullable,
  ZodOptional,
} from "zod";
import {
  HIDDEN_ID_PROPERTY,
  isSchemaWithHiddenProperties,
} from "./createFieldSchema";
import { RTFSupportedZodTypes } from "./supportedZodTypes";

const unwrappableTypes = [
  z.ZodFirstPartyTypeKind.ZodOptional,
  z.ZodFirstPartyTypeKind.ZodNullable,
  z.ZodFirstPartyTypeKind.ZodBranded,
  z.ZodFirstPartyTypeKind.ZodDefault,
  z.ZodFirstPartyTypeKind.ZodLazy,
] as const;
const unwrappable = new Set(unwrappableTypes);

export type UnwrappedRTFSupportedZodTypes = {
  type: RTFSupportedZodTypes;
  [HIDDEN_ID_PROPERTY]: string | null;
};

export function assertNever(x: never): never {
  throw new Error("[assertNever] Unexpected value: " + x);
}

type UnwrappableType = (typeof unwrappableTypes)[number];

function isUnwrappable(type: ZodFirstPartyTypeKind): type is UnwrappableType {
  return unwrappable.has(type as UnwrappableType);
}

export function unwrap(
  type: RTFSupportedZodTypes
): UnwrappedRTFSupportedZodTypes {
  // Realized zod has a built in "unwrap()" function after writing this.
  // Not sure if it's super necessary.
  let r = type;
  let unwrappedHiddenId: null | string = null;

  while (isUnwrappable(r._def.typeName)) {
    if (isSchemaWithHiddenProperties(r)) {
      unwrappedHiddenId = r._def[HIDDEN_ID_PROPERTY];
    }
    switch (r._def.typeName) {
      case z.ZodFirstPartyTypeKind.ZodOptional:
        r = r._def.innerType;
        break;
      case z.ZodFirstPartyTypeKind.ZodBranded:
        r = r._def.type;
        break;
      case z.ZodFirstPartyTypeKind.ZodNullable:
        r = r._def.innerType;
        break;
      // @ts-ignore
      case z.ZodFirstPartyTypeKind.ZodDefault:
        // @ts-ignore
        r = r._def.innerType;
        break;
      case z.ZodFirstPartyTypeKind.ZodLazy:
        // @ts-ignore
        r = r._def.getter();
        break;
      default:
        assertNever(r._def.typeName);
    }
  }

  let innerHiddenId: null | string = null;

  if (isSchemaWithHiddenProperties(r)) {
    innerHiddenId = r._def[HIDDEN_ID_PROPERTY];
  }

  return {
    type: r,
    [HIDDEN_ID_PROPERTY]: innerHiddenId || unwrappedHiddenId,
  };
}

export function unwrapEffects(effects: RTFSupportedZodTypes) {
  if (effects._def.typeName === ZodFirstPartyTypeKind.ZodEffects) {
    return effects._def.schema;
  }
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
  : T extends ZodOptional<any> | ZodNullable<any> | ZodDefault<any>
  ? UnwrapZodType<T["_def"]["innerType"], UnwrapPreviousLevel[Level]>
  : T extends ZodArray<any, any>
  ? // allow another 4 levels of recursiion for the array
    ZodArray<UnwrapZodType<T["element"], UnwrapMaxRecursionDepth>>
  : T extends ZodEnum<any>
  ? ZodEnum<any>
  : T;
