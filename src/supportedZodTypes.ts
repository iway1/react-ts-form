import {
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodDiscriminatedUnion,
  ZodEnum,
  ZodMap,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRecord,
  ZodSet,
  ZodString,
  ZodTuple,
} from "zod/v4";

/**
 * Reducing this helps with TS performance
 */
export type RTFBaseZodType =
  | ZodString
  | ZodNumber
  | ZodBoolean
  | ZodDate
  | ZodArray<any>
  | ZodObject<any, any>
  | ZodDiscriminatedUnion<any, any>
  | ZodTuple<any, any>
  | ZodRecord<any, any>
  | ZodMap<any>
  | ZodSet<any>
  | ZodEnum<any>

export type RTFSupportedZodTypes =
  | RTFBaseZodType
  | ZodOptional<any>
  | ZodNullable<any>;
