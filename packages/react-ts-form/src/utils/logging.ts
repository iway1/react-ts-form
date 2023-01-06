import {ZodFirstPartyTypeKind} from 'zod';
import {RTFSupportedZodTypes} from '../types/zod';

const shownWarnings = {
  enum: false,
  useEnum: false,
  duplicateSchema: false,
};

function err(message: string) {
  console.warn(`@ts-react/form: ${message}`);
}

export function duplicateTypeError() {
  if (shownWarnings.duplicateSchema) return;
  shownWarnings.duplicateSchema = true;
  err(
    'Found duplicate zod schema in zod-component mapping. Each zod type in the mapping must be unique, if you need to map multiple of the same types to different schemas use createUniqueFieldSchema.',
  );
}

export function printWarningsForSchema(type: RTFSupportedZodTypes) {
  if (
    !shownWarnings.enum &&
    type._def.typeName === ZodFirstPartyTypeKind.ZodEnum
  ) {
    err(
      'support for z.enum() is deprecated and will be removed in future versions. Prefer z.string() / z.number() etc for dropdowns, selects, and radio buttons. \nSee https://github.com/iway1/react-ts-form/blob/main/field-examples.md for examples',
    );
    shownWarnings.enum = true;
  }
}

export function printUseEnumWarning() {
  if (!shownWarnings.useEnum) {
    err(
      'useEnumValues is deprecated and will be removed in future versions. See https://github.com/iway1/react-ts-form/blob/main/field-examples.md for examples of how to implement selects/dropdowns etc without enums.',
    );
    shownWarnings.useEnum = true;
  }
}
