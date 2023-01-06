import {useFieldContext} from './useFieldContext';

class RequiredDescriptionError extends Error {
  constructor(data: string) {
    super(data);
    this.message = `No ${data} found when calling useRequiredDescription. Either pass it as a prop or pass it using the zod .describe() syntax.`;
  }
}

/**
 * Gets the description `{label: string, placeholder: string}` for the field. Throws an error if no label or placeholder is found.
 * If you don't want the error to throw, you may enjoy the `useDescription()` hook.
 * @example
 * ```tsx
 * const {label, placeholder} = useRequiredDescription();
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
export function useRequiredDescription() {
  const {label, placeholder} = useFieldContext('useRequiredDescription');

  if (!label) {
    throw new RequiredDescriptionError('label');
  }

  if (!placeholder) {
    throw new RequiredDescriptionError('placeholder');
  }

  return {
    label,
    placeholder,
  };
}
