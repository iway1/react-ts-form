import { RTFSupportedZodTypes } from "./supportedZodTypes";
import { FormComponentMapping } from "./createSchemaForm";
import { isZodTypeEqual } from "./isZodTypeEqual";

export function getComponentForZodType(
  zodType: RTFSupportedZodTypes,
  mapping: FormComponentMapping
) {
  for (const mappingElement of mapping) {
    if (isZodTypeEqual(zodType, mappingElement[0])) return mappingElement[1];
  }
  return;
}
