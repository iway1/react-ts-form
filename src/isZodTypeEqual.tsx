import * as z from "zod";
import type { RTFSupportedZodTypes } from "./supportedZodTypes";
import { unwrap } from "./unwrap";

export function isZodTypeEqual(
	_a: RTFSupportedZodTypes,
	_b: RTFSupportedZodTypes,
): boolean {
	// Recursively check objects
	// if typeNames are equal Unwrap Appropriate Types:
	// optional

	const { type: a, _rtf_id: idA } = unwrap(_a);
	const { type: b, _rtf_id: idB } = unwrap(_b);

	if (idA || idB) {
		return idA === idB;
	}

  if (a._zod.def.type !== b._zod.def.type) {
    return false;
  }

  if (a instanceof z.ZodArray && b instanceof z.ZodArray) {
    return isZodTypeEqual(a._zod.def.element, a._zod.def.element);
  } else if (a instanceof z.ZodSet && b instanceof z.ZodSet) {
    return isZodTypeEqual(a._zod.def.valueType, a._zod.def.valueType);
  } else if (a instanceof z.ZodMap && b instanceof z.ZodMap) {
    return isZodTypeEqual(a._zod.def.keyType, b._zod.def.keyType) && isZodTypeEqual(a._zod.def.valueType, a._zod.def.valueType)
  } else if (a instanceof z.ZodRecord && b instanceof z.ZodRecord) {
    return isZodTypeEqual(a._zod.def.keyType, b._zod.def.keyType) && isZodTypeEqual(a._zod.def.valueType, a._zod.def.valueType)
  } else if (a instanceof z.ZodTuple && b instanceof z.ZodTuple) {
    const aItems: any[] = a._zod.def.items
    const bItems: any[] = b._zod.def.items;
    if (aItems.length !== bItems.length) return false;
    return aItems.every((aItem: any, i) => isZodTypeEqual(aItem, bItems[i]));
  } else if (a instanceof z.ZodObject && b instanceof z.ZodObject) {
    const aShape = a._zod.def.shape;
    const bShape = b._zod.def.shape;
    if (!aShape || !bShape) {
      return false;
    }

    const aKeys = Object.keys(aShape);
    const bKeys = Object.keys(bShape);
    if (!(aKeys.every((aKey) => bKeys.includes(aKey)) && bKeys.every((bKey) => aKeys.includes(bKey)))) {
      return false;
    }
   
    return aKeys.every((aKey) => isZodTypeEqual(aShape[aKey], bShape[aKey]));
  }

  return a === b;
  
}