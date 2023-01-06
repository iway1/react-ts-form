import {printUseEnumWarning} from '../utils/logging';
import {useFieldContext} from './useFieldContext';

const EnumValueError = new Error(
  `Enum values not passed. Any component that calls useEnumValues should be rendered from an '.enum()' zod field.`,
);

/**
 * Gets an enum fields values. Throws an error if there are no enum values found (IE you mapped a z.string() to a component
 * that calls this hook).
 *
 * @example
 * ```tsx
 * const options = useEnumValues();
 *
 * return (
 *  <select>
 *    {options.map(e=>(
 *      <option
 *        value={e}
 *      >
 *        {titleCase(e)}
 *      </option>
 *    ))}
 *  </select>
 * )
 * ```
 */
export function useEnumValues() {
  const {enumValues} = useFieldContext('useEnumValues');

  printUseEnumWarning();

  if (!enumValues) {
    throw EnumValueError;
  }

  return enumValues;
}
