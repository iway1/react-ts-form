import { z } from "zod";

/**
 * Constrains a type to an object other than an array.
 */
export type NonArrayObject = object & { length?: never };

const ObjectSchema = z.object({});

const TopLevelErrorSchema = z.object({
  message: z.string(),
  type: z.string(),
});

function isObj(o: any): o is object {
  return ObjectSchema.safeParse(o).success;
}

function isWithTopLevelErrorMessage(
  o: any
): o is z.infer<typeof TopLevelErrorSchema> {
  return TopLevelErrorSchema.safeParse(o).success;
}

export type RecursiveErrorType<T extends any> = T extends object
  ?
      | {
          errorMessage?: string;
        } & {
          [key in keyof T]+?: RecursiveErrorType<T[key]>;
        }
  : {
      errorMessage: string;
    };

export function errorFromRhfErrorObject<T>(
  o: any
): RecursiveErrorType<T> | undefined {
  if (!isObj(o)) return;
  if (isWithTopLevelErrorMessage(o))
    return { errorMessage: o.message } as RecursiveErrorType<T>;

  // Here we know it's a recursive error object
  const r: any = {};
  for (const key in o) {
    r[key] = errorFromRhfErrorObject((o as any)[key]);
  }

  return r;
}
