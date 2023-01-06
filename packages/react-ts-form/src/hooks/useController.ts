import {
  DeepPartial,
  useController as useReactHookFormController,
  UseControllerReturn,
} from 'react-hook-form';
import {errorFromRhfErrorObject} from '../utils/zodObjectErrors';

import {useFieldContext} from './useFieldContext';

/**
 * Allows working accessing and updating the form state for a field. Returns everything that a vanilla `react-hook-form` returns
 * `useController` call returns but with additional typesafety. Additionally, returns an `errors` object that provides a typesafe way
 * of dealing with nested react hook form errors.
 * @example
 * const {field: {onChange, value}, errors} = useTsController<string>()
 *
 * return (
 *  <>
 *    <input
 *      value={value}
 *      onChange={(e)=>onChange(e.target.value)}
 *    />
 *    {errors?.errorMessage ? <span>{errors.errorMessage}</span> : null}
 *  </>
 * )
 */
export function useController<FieldType extends any>() {
  const context = useFieldContext('useTsController');

  type IsObj = FieldType extends Object ? true : false;

  // Just gives better types to useController
  const controller = useReactHookFormController(context) as any as Omit<
    UseControllerReturn,
    'field'
  > & {
    field: Omit<UseControllerReturn['field'], 'value' | 'onChange'> & {
      value: FieldType | undefined;
      onChange: (
        value: IsObj extends true
          ? DeepPartial<FieldType> | undefined
          : FieldType | undefined,
      ) => void;
    };
  };

  const {fieldState} = controller;
  // Typings for error objects get f'd up w/ nested objects in `react-hook-form` so we build a friendlier object / type

  return {
    ...controller,
    error: errorFromRhfErrorObject<FieldType>(fieldState.error),
  };
}
