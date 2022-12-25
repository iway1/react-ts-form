import { z, ZodNullable, ZodOptional } from "zod";
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

// IDK if we'll need this but good to have reference
// type UnwrappableType = ZodOptional<any> | ZodNullable<any>;

/**
 * I'd like this to be recursive but it creates an "infinite instantiation error" if I make it call itself.
 * Might dumpster performance.
 * Anyways this is probably just as good for normal usage, although it'll shit the bed on nullish.
 */
export type UnwrapZodType<T extends RTFSupportedZodTypes> =
  T extends ZodOptional<any>
    ? T["_def"]["innerType"]
    : T extends ZodNullable<any>
    ? T["_def"]["innerType"] extends ZodOptional<any>
      ? T["_def"]["innerType"]["_def"]["innerType"]
      : T["_def"]["innerType"]
    : T;
