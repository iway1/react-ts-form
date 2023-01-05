import { ZodFirstPartyTypeKind } from "zod";
import { RTFSupportedZodTypes } from "./supportedZodTypes";
import { unwrap } from "./unwrap";

export function isZodTypeEqual(
  _a: RTFSupportedZodTypes,
  _b: RTFSupportedZodTypes
) {
  // Recursively check objects
  // if typeNames are equal Unwrap Appropriate Types:
  // optional

  let { type: a, _rtf_id: idA } = unwrap(_a);
  let { type: b, _rtf_id: idB } = unwrap(_b);

  if (idA || idB) {
    return idA === idB;
  }

  if (a._def.typeName !== b._def.typeName) return false;

  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodArray &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodArray
  ) {
    if (isZodTypeEqual(a._def.type, b._def.type)) return true;
    return false;
  }

  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodSet &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodSet
  ) {
    if (isZodTypeEqual(a._def.valueType, b._def.valueType)) return true;
    return false;
  }

  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodMap &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodMap
  ) {
    if (
      isZodTypeEqual(a._def.keyType, b._def.keyType) &&
      isZodTypeEqual(a._def.valueType, b._def.valueType)
    )
      return true;

    return false;
  }

  // record
  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodRecord &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodRecord
  ) {
    if (isZodTypeEqual(a._def.valueType, b._def.valueType)) return true;
    return false;
  }

  // tuple
  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodTuple &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodTuple
  ) {
    const itemsA = a._def.items;
    const itemsB = b._def.items;
    if (itemsA.length !== itemsB.length) return false;
    for (let i = 0; i < itemsA.length; i++) {
      if (!isZodTypeEqual(itemsA[i], itemsB[i])) return false;
    }
    return true;
  }

  // Recursively check if objects are equal
  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodObject &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodObject
  ) {
    const shapeA = a._def.shape();
    const shapeB = b._def.shape();
    if (!shapeA || !shapeB) {
      if (!shapeA && !shapeB) return true;
      return false;
    }
    const keysA = Object.keys(shapeA);
    const keysB = Object.keys(shapeB);
    const setA = new Set(keysA);
    const setB = new Set(keysB);

    for (const key of keysB) {
      if (!setA.has(key)) return false;
    }

    for (const key of keysA) {
      if (!setB.has(key)) return false;
    }

    for (var key of keysA) {
      const valA = shapeA[key];
      const valB = shapeB[key];
      if (!valB || !isZodTypeEqual(valA, valB)) return false;
    }
  }
  return true;
}
