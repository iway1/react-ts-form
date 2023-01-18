import { z } from "zod";
import { RTFSupportedZodTypes } from "./supportedZodTypes";
import { unwrap } from "./unwrap";

export const SPLIT_DESCRIPTION_SYMBOL = " // ";

export function parseDescription(description?: string) {
  if (!description) return;
  const [label, ...rest] = description
    .split(SPLIT_DESCRIPTION_SYMBOL)
    .map((e) => e.trim());
  const placeholder = rest.join(SPLIT_DESCRIPTION_SYMBOL);
  return {
    label: label!,
    placeholder: placeholder ? placeholder : undefined,
  };
}

export function getEnumValues(type: RTFSupportedZodTypes) {
  if (!(type._def.typeName === z.ZodFirstPartyTypeKind.ZodEnum)) return;
  return type._def.values as readonly string[];
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
