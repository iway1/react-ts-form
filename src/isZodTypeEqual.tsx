import {
  ZodObject,
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodNumber,
  ZodString,
} from "zod";
import {
  RTFSupportedZodTypes,
  ZodFormSupportedTypeStrings,
} from "./supportedZodTypes";
import { unwrap } from "./unwrap";

export function isZodTypeEqual(
  _a: RTFSupportedZodTypes,
  _b: RTFSupportedZodTypes
) {
  // Recursively check objects
  // if types are equal Unwrap Appropriate Types:
  // optional

  let { type: a, _rtf_id: idA } = unwrap(_a);
  let { type: b, _rtf_id: idB } = unwrap(_b);

  if (idA || idB) {
    return idA === idB;
  }

  if (a.def.type !== b.def.type) return false;

  // array

  if (a.def.type === "array" && b.def.type === "array") {
    // TODO: this is any right now
    if (isZodTypeEqual(a.def.element, b.def.element)) return true;
    return false;
  }

  // set

  if (a.def.type === "set" && b.def.type === "set") {
    // TODO: this is any right now
    if (isZodTypeEqual(a.def.valueType, b.def.valueType)) return true;
    return false;
  }

  // map

  if (a.def.type === "map" && b.def.type === "map") {
    if (
      isZodTypeEqual(a.def.keyType, b.def.keyType) &&
      isZodTypeEqual(
        a.def.valueType as RTFSupportedZodTypes,
        b.def.valueType as RTFSupportedZodTypes
      )
    )
      return true;

    return false;
  }

  // record
  if (a.def.type === "record" && b.def.type === "record") {
    // TODO: this is any right now
    if (
      isZodTypeEqual(a.def.valueType, b.def.valueType) &&
      isZodTypeEqual(a.def.keyType, b.def.keyType)
    )
      return true;
    return false;
  }

  // tuple
  if (a.def.type === "tuple" && b.def.type === "tuple") {
    // TODO: this is any right now
    const itemsA = a.def.items;
    const itemsB = b.def.items;
    if (itemsA.length !== itemsB.length) return false;
    for (let i = 0; i < itemsA.length; i++) {
      if (!isZodTypeEqual(itemsA[i], itemsB[i])) return false;
    }
    return true;
  }

  // Recursively check if objects are equal
  if (a.def.type === "object" && b.def.type === "object") {
    // TODO: this is any right now
    const shapeA = a.def.shape;
    const shapeB = b.def.shape;
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
      if (
        !valB ||
        !isZodTypeEqual(
          valA as RTFSupportedZodTypes,
          valB as RTFSupportedZodTypes
        )
      )
        return false;
    }
  }
  return true;
}

// Guards

export function isZodString(
  zodType: RTFSupportedZodTypes
): zodType is ZodString {
  return isTypeOf(zodType, "string");
}

export function isZodNumber(
  zodType: RTFSupportedZodTypes
): zodType is ZodNumber {
  return isTypeOf(zodType, "number");
}

export function isZodBoolean(
  zodType: RTFSupportedZodTypes
): zodType is ZodBoolean {
  return isTypeOf(zodType, "boolean");
}

export function isZodArray(
  zodType: RTFSupportedZodTypes
): zodType is ZodArray<any> {
  return isTypeOf(zodType, "array");
}

export function isZodObject(
  zodType: RTFSupportedZodTypes
): zodType is ZodObject {
  return isTypeOf(zodType, "object");
}

export function isZodDate(zodType: RTFSupportedZodTypes): zodType is ZodDate {
  return isTypeOf(zodType, "date");
}

export function isTypeOf(
  zodType: RTFSupportedZodTypes,
  type: ZodFormSupportedTypeStrings
) {
  return zodType.def.type === type;
}

export type RTFSupportedZodFirstPartyTypeKindMap = {
  [K in RTFSupportedZodTypes["def"]["type"]]: Extract<
    RTFSupportedZodTypes,
    { def: { type: K } }
  >;
};

export type RTFSupportedZodFirstPartyTypeKind =
  keyof RTFSupportedZodFirstPartyTypeKindMap;
