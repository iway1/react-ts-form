// biome-ignore lint: nuh uh
import * as z from "zod";

/**
 * Reducing this helps with TS performance
 */
export type RTFBaseZodType =
	| z.ZodString
	| z.ZodNumber
	| z.ZodBoolean
	| z.ZodDate
	| z.ZodArray<any>
	| z.ZodObject<any, any>
	| z.ZodDiscriminatedUnion
	| z.ZodTuple<any, any>
	| z.ZodRecord<any, any>
	| z.ZodMap<any, any>
	| z.ZodSet<any>
	| z.ZodEnum
	| z.core.$ZodBranded<z.ZodType, any>;

export type RTFSupportedZodTypes =
	| RTFBaseZodType
	| z.ZodOptional<any>
	| z.ZodNullable<any>;