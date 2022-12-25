import { RTFSupportedZodTypes } from "./supportedZodTypes";

export const HIDDEN_ID_PROPERTY = "_rtf_id";

type HiddenProperties = {
  [HIDDEN_ID_PROPERTY]: string;
};

type SchemaWithHiddenProperties<T extends RTFSupportedZodTypes> = T &
  HiddenProperties;

export function isSchemaWithHiddenProperties<T extends RTFSupportedZodTypes>(
  schemaType: T
): schemaType is SchemaWithHiddenProperties<T> {
  return HIDDEN_ID_PROPERTY in schemaType;
}

export function addHiddenProperties<T extends RTFSupportedZodTypes>(
  schema: T,
  properties: HiddenProperties
) {
  for (const key in properties) {
    (schema as any)[key] = properties[key as keyof typeof properties];
  }
  return schema;
}

let usedIdsSet = new Set<string>();

/**
 * @internal
 */
export function testingResetUsedIdsSet() {
  usedIdsSet = new Set();
}

export function duplicateIdErrorMessage(id: string) {
  return `Duplicate id passed to createFieldSchema: ${id}. Ensure that each id is only being used once and that createFieldSchema is only called at the top level.`;
}

export function createFieldSchema<
  T extends RTFSupportedZodTypes,
  Identifier extends string
>(schema: T, id: Identifier) {
  if (usedIdsSet.has(id)) throw new Error(duplicateIdErrorMessage(id));
  usedIdsSet.add(id);
  const r = schema.brand<Identifier>();
  return addHiddenProperties(r, { [HIDDEN_ID_PROPERTY]: id });
}
