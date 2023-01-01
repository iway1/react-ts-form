import React, { useContext } from "react";
import { createContext, ReactNode } from "react";
import {
  Control,
  DeepPartial,
  useController,
  UseControllerReturn,
} from "react-hook-form";
import { errorFromRhfErrorObject } from "./zodObjectErrors";

export const FieldContext = createContext<null | {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  enumValues?: string[];
}>(null);

export function FieldContextProvider({
  name,
  control,
  children,
  label,
  placeholder,
  enumValues,
}: {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  enumValues?: string[];
  children: ReactNode;
}) {
  return (
    <FieldContext.Provider
      value={{ control, name, label, placeholder, enumValues }}
    >
      {children}
    </FieldContext.Provider>
  );
}

function useContextProt(name: string) {
  const context = useContext(FieldContext);
  if (!context)
    throw Error(
      `${name} must be called from within a FieldContextProvider... if you use this hook, the component must be rendered by @ts-react/form.`
    );
  return context;
}

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
 *    {errors?.errorMessage && <span>{errors.errorMessage}</span>}
 *  </>
 * )
 */
export function useTsController<FieldType extends any>() {
  const context = useContextProt("useTsController");
  type IsObj = FieldType extends Object ? true : false;
  // Just gives better types to useController
  const controller = useController(context) as any as Omit<
    UseControllerReturn,
    "field"
  > & {
    field: Omit<UseControllerReturn["field"], "value" | "onChange"> & {
      value: FieldType | undefined;
      onChange: (
        value: IsObj extends true
          ? DeepPartial<FieldType> | undefined
          : FieldType | undefined
      ) => void;
    };
  };
  const { fieldState } = controller;
  // Typings for error objects get f'd up w/ nested objects in `react-hook-form` so we build a friendlier object / type

  return {
    ...controller,
    error: errorFromRhfErrorObject<FieldType>(fieldState.error),
  };
}

export function requiredDescriptionDataNotPassedError(
  name: string,
  hookName: string
) {
  return `No ${name} found when calling ${hookName}. Either pass it as a prop or pass it using the zod .describe() syntax.`;
}

/**
 * Gets the description `{label: string, placeholder: string}` for the field. Will return the description created via the zod .describe syntax.
 * description properties are optional, if you want to them to be required and throw an error when not passed, you may enjoy `useReqDescription()`;
 * @example
 * ```tsx
 * const {label, placeholder} = useDescription();
 *
 * return (
 *  <>
 *    <label>{label?label:'No label'}</label>}
 *    <input
 *      //...
 *
 *      placeholder={placeholder?placeholder:'No placeholder passed'}
 *    />
 *  </>
 * )
 * ```
 * @returns `{label: string, placeholder: string}`
 */
export function useDescription() {
  const { label, placeholder } = useContextProt("useReqDescription");
  return {
    label,
    placeholder,
  };
}

/**
 * Gets the description `{label: string, placeholder: string}` for the field. Throws an error if no label or placeholder is found.
 * If you don't want the error to throw, you may enjoy the `useDescription()` hook.
 * @example
 * ```tsx
 * const {label, placeholder} = useReqDescription();
 *
 * return (
 *  <>
 *    <label>{label}</label>}
 *    <input
 *      //...
 *
 *      placeholder={placeholder?placeholder:'No placeholder passed'}
 *    />
 *  </>
 * )
 * ```
 * @returns `{label: string, placeholder: string}`
 */
export function useReqDescription() {
  const { label, placeholder } = useContextProt("useReqDescription");
  if (!label) {
    throw new Error(
      requiredDescriptionDataNotPassedError("label", "useReqDescription")
    );
  }
  if (!placeholder) {
    throw new Error(
      requiredDescriptionDataNotPassedError("placeholder", "useReqDescription")
    );
  }
  return {
    label,
    placeholder,
  };
}

export function enumValuesNotPassedError() {
  return `Enum values not passed. Any component that calls useEnumValues should be rendered from an '.enum()' zod field.`;
}

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
  const { enumValues } = useContextProt("useEnumValues");
  if (!enumValues) throw new Error(enumValuesNotPassedError());
  return enumValues;
}
