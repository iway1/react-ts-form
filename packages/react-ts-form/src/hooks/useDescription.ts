import {useFieldContext} from './useFieldContext';

/**
 * Gets the description `{label: string, placeholder: string}` for the field. Will return the description created via the zod .describe syntax.
 * description properties are optional, if you want to them to be required and throw an error when not passed, you may enjoy `useReqDescription()`;
 * @example
 * ```tsx
 * const {label, placeholder} = useDescription();
 *
 * return (
 *  <>
 *    <label>{label || 'No label'}</label>}
 *    <input
 *      //...other input props
 *      placeholder={placeholder || 'No placeholder passed' }
 *    />
 *  </>
 * )
 * ```
 * @returns `{label: string, placeholder: string}`
 */
export function useDescription() {
  const {label, placeholder} = useFieldContext('useReqDescription');

  return {
    label,
    placeholder,
  };
}
