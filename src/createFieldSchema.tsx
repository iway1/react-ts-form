import { z, ZodBranded } from "zod";
import { RTFSupportedZodTypes } from "./supportedZodTypes";

export const HIDDEN_ID_PROPERTY = "_rtf_id";

/**
 * @internal
 */
export type HiddenProperties = {
  [HIDDEN_ID_PROPERTY]: string;
};

/**
 * @internal
 */
export type SchemaWithHiddenProperties<T extends RTFSupportedZodTypes> = T & {
  _def: T["_def"] & HiddenProperties;
};

export function isSchemaWithHiddenProperties<T extends RTFSupportedZodTypes>(
  schemaType: T
): schemaType is SchemaWithHiddenProperties<T> {
  return HIDDEN_ID_PROPERTY in schemaType._def;
}

export function addHiddenProperties<
  ID extends string,
  T extends RTFSupportedZodTypes
>(schema: T, properties: HiddenProperties) {
  for (const key in properties) {
    (schema._def as any)[key] = properties[key as keyof typeof properties];
  }
  return schema as ZodBranded<T, ID>;
}

export function duplicateIdErrorMessage(id: string) {
  return `Duplicate id passed to createFieldSchema: ${id}. Ensure that each id is only being used once and that createFieldSchema is only called at the top level.`;
}

/**
 * Creates a schema that will map to a unique component. This can be used when you want multiple of the same zod type to map to different React Components
 * @example
 * ```tsx
 * const MyUniqueSchema = createUniqueFieldSchema(z.string(), "any-unique-string");
 * const mapping = [
 *  [MyUniqueSchema, AComponent] as const
 * ] as const;
 * //...
 * <MyForm
 *  schema={z.object({
 *    field: MyUniqueSchema // this will render to AComponent
 *  })}
 * />
 * ```
 * @param schema A zod schema.
 * @param id A unique id string (this can be anything but needs to be explcitily passed).
 * @returns A normal zod schema that will be uniquely identified in the zod-component mapping.
 */
export function createUniqueFieldSchema<
  T extends RTFSupportedZodTypes,
  Identifier extends string
>(schema: T, id: Identifier) {
  const r = schema.brand<Identifier>();
  return addHiddenProperties<Identifier, typeof r>(r, {
    [HIDDEN_ID_PROPERTY]: id,
  }) as z.ZodBranded<T, Identifier>;
}
