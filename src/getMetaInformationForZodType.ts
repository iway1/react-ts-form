import { z } from "zod";
import { RTFSupportedZodTypes } from "./supportedZodTypes";
import { unwrap } from "./unwrap";

export const SPLIT_DESCRIPTION_SYMBOL = "//";

export function parseDescription(description?: string) {
  if (!description) return;
  const split = description
    .split(SPLIT_DESCRIPTION_SYMBOL)
    .map((e) => e.trim());
  return {
    label: split[0]!,
    placeholder: split[1],
  };
}

export function getEnumValues(type: RTFSupportedZodTypes) {
  switch (type._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodEnum:
      return type._def.values as readonly string[];
    case z.ZodFirstPartyTypeKind.ZodNativeEnum:
      return Object.values(type._def.values) as readonly string[];
    default:
      return;
  }
}

function isSchemaWithUnwrapMethod(
  schema: object
): schema is { unwrap: () => RTFSupportedZodTypes } {
  return "unwrap" in schema;
}

function recursivelyGetDescription(type: RTFSupportedZodTypes) {
  let t = type;
  if (t._def.description) return t._def.description;
  while (isSchemaWithUnwrapMethod(t)) {
    t = t.unwrap();
    if (t._def.description) return t._def.description;
  }
  return;
}

export function getMetaInformationForZodType(type: RTFSupportedZodTypes) {
  // TODO - Maybe figure out how to not call unwrap here? Seems wasteful calling it twice... probably doesn't matter though.
  const unwrapped = unwrap(type);
  const description = recursivelyGetDescription(type);
  return {
    description: parseDescription(description),
    enumValues: getEnumValues(unwrapped.type),
  };
}
