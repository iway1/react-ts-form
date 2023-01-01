import {
  z,
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
]);

export function unwrap(type: RTFSupportedZodTypes): {
  type: RTFSupportedZodTypes;
  [HIDDEN_ID_PROPERTY]: string | null;
} {
  // Realized zod has a built in "unwrap()" function after writing this.
  // Not sure if it's super necessary.
  let r = type;
  let hiddenId: null | string = null;
  if (isSchemaWithHiddenProperties(type)) {
    hiddenId = type[HIDDEN_ID_PROPERTY];
  }

  while (unwrappable.has(r._def.typeName)) {
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
    }
  }

  return {
    type: r,
    [HIDDEN_ID_PROPERTY]: hiddenId,
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
    ? T["_def"]["innerType"]
    : T extends ZodNullable<any>
    ? T["_def"]["innerType"] extends ZodOptional<any>
      ? EnumAsAnyEnum<T["_def"]["innerType"]["_def"]["innerType"]>
      : EnumAsAnyEnum<T["_def"]["innerType"]>
    : EnumAsAnyEnum<T>;

export type EnumAsAnyEnum<T extends RTFSupportedZodTypes> =
  T extends ZodEnum<any> ? ZodEnum<any> : T;
