import {z} from 'zod';
import {RecursiveErrorType} from '../types/response';

const ObjectSchema = z.object({});

const TopLevelErrorSchema = z.object({
  message: z.string(),
  type: z.string(),
});

function isObj(o: any): o is object {
  return ObjectSchema.safeParse(o).success;
}

function isWithTopLevelErrorMessage(
  o: any,
): o is z.infer<typeof TopLevelErrorSchema> {
  return TopLevelErrorSchema.safeParse(o).success;
}

export function errorFromRhfErrorObject<T>(
  o: any,
): RecursiveErrorType<T> | undefined {
  const isObject = isObj(o);

  if (!isObject) {
    return;
  }

  const containsError = isWithTopLevelErrorMessage(o);

  if (containsError) {
    return {errorMessage: o.message} as RecursiveErrorType<T>;
  }

  // Here we know it's a recursive error object
  const r: any = {};
  for (const key in o) {
    r[key] = errorFromRhfErrorObject((o as any)[key]);
  }

  return r;
}
