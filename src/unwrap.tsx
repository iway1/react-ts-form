import {
  z,
  ZodArray,
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

const unwrappable = new Set<z.ZodFirstPartyTypeKind>([
  z.ZodFirstPartyTypeKind.ZodOptional,
  z.ZodFirstPartyTypeKind.ZodNullable,
  z.ZodFirstPartyTypeKind.ZodBranded,
  z.ZodFirstPartyTypeKind.ZodDefault,
]);

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

  while (unwrappable.has(r._def.typeName)) {
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

/**
 * I'd like this to be recursive but it creates an "infinite instantiation error" if I make it call itself.
 * This is probably just as good for normal usage?
 */
export type UnwrapZodType<T extends RTFSupportedZodTypes> =
  T extends ZodOptional<any>
    ? T["_def"]["innerType"] extends ZodNullable<any>
      ? GenericizeLeafTypes<T["_def"]["innerType"]["_def"]["innerType"]>
      : GenericizeLeafTypes<T["_def"]["innerType"]>
    : T extends ZodNullable<any>
    ? T["_def"]["innerType"] extends ZodOptional<any>
      ? GenericizeLeafTypes<T["_def"]["innerType"]["_def"]["innerType"]>
      : GenericizeLeafTypes<T["_def"]["innerType"]>
    : GenericizeLeafTypes<T>;

export type GenericizeLeafTypes<T extends RTFSupportedZodTypes> =
  ArrayAsLengthAgnostic<EnumAsAnyEnum<T>>;

export type ArrayAsLengthAgnostic<T extends RTFSupportedZodTypes> =
  T extends ZodArray<any, any> ? ZodArray<T["element"]> : T;

export type EnumAsAnyEnum<T extends RTFSupportedZodTypes> =
  T extends ZodEnum<any> ? ZodEnum<any> : T;
