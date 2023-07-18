import {
  AnyZodObject,
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodDefaultDef,
  ZodFirstPartyTypeKind,
  ZodNumber,
  ZodString,
  z,
} from "zod";
import { RTFSupportedZodTypes } from "./supportedZodTypes";
import { unwrap } from "./unwrap";

export function isZodTypeEqualImpl(
  _a: RTFSupportedZodTypes,
  _b: RTFSupportedZodTypes,
  visitedTypes: Set<RTFSupportedZodTypes>
) {
  // Recursively check objects
  // if typeNames are equal Unwrap Appropriate Types:
  // optional

  let { type: a, _rtf_id: idA } = unwrap(_a);
  let { type: b, _rtf_id: idB } = unwrap(_b);
  if (visitedTypes.has(a) && visitedTypes.has(b)) return true;
  visitedTypes.add(a);
  visitedTypes.add(b);

  if (idA || idB) {
    return idA === idB;
  }

  if (a._def.typeName !== b._def.typeName) return false;

  // array

  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodArray &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodArray
  ) {
    if (isZodTypeEqualImpl(a._def.type, b._def.type, visitedTypes)) return true;
    return false;
  }

  // set

  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodSet &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodSet
  ) {
    if (isZodTypeEqualImpl(a._def.valueType, b._def.valueType, visitedTypes))
      return true;
    return false;
  }

  // map

  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodMap &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodMap
  ) {
    if (
      isZodTypeEqualImpl(a._def.keyType, b._def.keyType, visitedTypes) &&
      isZodTypeEqualImpl(a._def.valueType, b._def.valueType, visitedTypes)
    )
      return true;

    return false;
  }

  // record
  if (
    a._def.typeName === ZodFirstPartyTypeKind.ZodRecord &&
    b._def.typeName === ZodFirstPartyTypeKind.ZodRecord
  ) {
    if (isZodTypeEqualImpl(a._def.valueType, b._def.valueType, visitedTypes))
      return true;
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
      if (!isZodTypeEqualImpl(itemsA[i], itemsB[i], visitedTypes)) return false;
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
      if (!valB || !isZodTypeEqualImpl(valA, valB, visitedTypes)) return false;
    }
  }
  return true;
}

export function isZodTypeEqual(
  _a: RTFSupportedZodTypes,
  _b: RTFSupportedZodTypes
) {
  return isZodTypeEqualImpl(_a, _b, new Set());
}

// Guards

export function isZodString(
  zodType: RTFSupportedZodTypes
): zodType is ZodString {
  return isTypeOf(zodType, "ZodString");
}

export function isZodNumber(
  zodType: RTFSupportedZodTypes
): zodType is ZodNumber {
  return isTypeOf(zodType, "ZodNumber");
}

export function isZodBoolean(
  zodType: RTFSupportedZodTypes
): zodType is ZodBoolean {
  return isTypeOf(zodType, "ZodBoolean");
}

export function isZodArray(
  zodType: RTFSupportedZodTypes
): zodType is ZodArray<any> {
  return isTypeOf(zodType, "ZodArray");
}

export function isZodObject(
  zodType: RTFSupportedZodTypes
): zodType is AnyZodObject {
  return isTypeOf(zodType, "ZodObject");
}

export function isZodDefaultDef(zodDef: unknown): zodDef is ZodDefaultDef {
  return Boolean(
    zodDef &&
      typeof zodDef === "object" &&
      "defaultValue" in zodDef &&
      typeof zodDef.defaultValue === "function"
  );
}

export function isZodDate(zodType: RTFSupportedZodTypes): zodType is ZodDate {
  return isTypeOf(zodType, "ZodDate");
}

export function isTypeOf(zodType: RTFSupportedZodTypes, type: ZodKindName) {
  return zodType._def.typeName === ZodFirstPartyTypeKind[type];
}

type ZodKindName = keyof typeof z.ZodFirstPartyTypeKind;

export type ZodKindNameToType<K extends keyof typeof z.ZodFirstPartyTypeKind> =
  InstanceType<(typeof z)[K]>;

export type RTFSupportedZodFirstPartyTypeKindMap = {
  [K in ZodKindName as ZodKindNameToType<K> extends RTFSupportedZodTypes
    ? K
    : never]: ZodKindNameToType<K>;
};

export type RTFSupportedZodFirstPartyTypeKind =
  keyof RTFSupportedZodFirstPartyTypeKindMap;
