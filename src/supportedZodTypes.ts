import {
  ZodType,
  type ZodArray,
  type ZodBoolean,
  type ZodDate,
  type ZodDiscriminatedUnion,
  type ZodEnum,
  type ZodMap,
  type ZodNullable,
  type ZodNumber,
  type ZodObject,
  type ZodOptional,
  type ZodRecord,
  type ZodSet,
  type ZodString,
  type ZodTuple,
} from "zod/v4";

export type ZodTypeInstance<T extends ZodType> = Extract<T, ZodType>;
/**
 * Reducing this helps with TS performance
 */
export type RTFBaseZodType =
  | ZodString
  | ZodNumber
  | ZodBoolean
  | ZodDate
  | ZodArray<any>
  | ZodObject<Record<string, ZodType>, any>
  | ZodDiscriminatedUnion<any, any>
  | ZodTuple<any, any>
  | ZodRecord<any, any>
  | ZodMap<any>
  | ZodSet<any>
  | ZodEnum;

export type RTFSupportedZodTypes =
  | RTFBaseZodType
  | ZodOptional<any>
  | ZodNullable<any>;

export type ZodFormSupportedTypeStrings =
  ZodTypeInstance<RTFSupportedZodTypes>["def"]["type"];
