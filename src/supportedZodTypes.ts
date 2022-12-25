import {
  ZodAny,
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodBranded,
  ZodDate,
  ZodDefault,
  ZodDiscriminatedUnion,
  ZodEffects,
  ZodEnum,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodMap,
  ZodNativeEnum,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRecord,
  ZodSet,
  ZodString,
  ZodTuple,
  ZodUnion,
} from "zod";

export type RTFSupportedZodTypes =
  | ZodString
  | ZodNumber
  | ZodBigInt
  | ZodBoolean
  | ZodDate
  | ZodAny
  | ZodArray<any, any>
  | ZodObject<any, any, any, any, any>
  | ZodUnion<any>
  | ZodDiscriminatedUnion<any, any>
  | ZodTuple<any, any>
  | ZodRecord<any, any>
  | ZodMap<any>
  | ZodSet<any>
  | ZodFunction<any, any>
  | ZodLazy<any>
  | ZodLiteral<any>
  | ZodEnum<any>
  | ZodEffects<any, any, any>
  | ZodNativeEnum<any>
  | ZodOptional<any>
  | ZodNullable<any>
  | ZodDefault<any>
  | ZodBranded<any, any>;

// not supports.. Things that don't make sense to have in a form.
// | ZodCatch<any>
// | ZodPromise<any>;
// | ZodIntersection<any, any>;
// | ZodNever
// | ZodVoid;
// | ZodUndefined
// | ZodNull;
// | ZodNaN,
// | ZodUnknown
