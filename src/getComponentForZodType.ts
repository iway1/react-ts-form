import type { FormComponentMapping } from "./createSchemaForm";
import { isZodTypeEqual } from "./isZodTypeEqual";
import type { RTFSupportedZodTypes } from "./supportedZodTypes";

export function getComponentForZodType(
	zodType: RTFSupportedZodTypes,
	mapping: FormComponentMapping,
) {
	for (const mappingElement of mapping) {
		if (isZodTypeEqual(zodType, mappingElement[0])) return mappingElement[1];
	}
	return;
}
