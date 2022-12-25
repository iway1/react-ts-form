import { z } from "zod";
import { RTFSupportedZodTypes } from "./supportedZodTypes";

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
  if (!(type._def.typeName === z.ZodFirstPartyTypeKind.ZodEnum)) return;
  return type._def.values as readonly string[];
}

export function getMetaInformationForZodType(type: RTFSupportedZodTypes) {
  return {
    description: parseDescription(type._def.description),
    enumValues: getEnumValues(type),
  };
}
