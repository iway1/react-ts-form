import React, { useContext, useState } from "react";
import { createContext, ReactNode } from "react";
import {
  Control,
  DeepPartial,
  useController,
  UseControllerReturn,
} from "react-hook-form";
import { printUseEnumWarning } from "./logging";
import { errorFromRhfErrorObject } from "./zodObjectErrors";
import { RTFSupportedZodTypes } from "./supportedZodTypes";
import { UnwrapZodType, unwrap } from "./unwrap";
import {
  RTFSupportedZodFirstPartyTypeKind,
  RTFSupportedZodFirstPartyTypeKindMap,
  isTypeOf,
} from "./isZodTypeEqual";

import {
  PickPrimitiveObjectProperties,
  pickPrimitiveObjectProperties,
} from "./utilities";

export const FieldContext = createContext<null | {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  enumValues?: string[];
  zodType: RTFSupportedZodTypes;
  addToCoerceUndefined: (v: string) => void;
  removeFromCoerceUndefined: (v: string) => void;
}>(null);

export function FieldContextProvider({
  name,
  control,
  children,
  label,
  placeholder,
  enumValues,
  zodType,
  addToCoerceUndefined,
  removeFromCoerceUndefined,
}: {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  enumValues?: string[];
  children: ReactNode;
  zodType: RTFSupportedZodTypes;
  addToCoerceUndefined: (v: string) => void;
  removeFromCoerceUndefined: (v: string) => void;
}) {
  return (
    <FieldContext.Provider
      value={{
        control,
        name,
        label,
        placeholder,
        enumValues,
        zodType,
        addToCoerceUndefined,
        removeFromCoerceUndefined,
      }}
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
  type OnChangeValue = IsObj extends true
    ? DeepPartial<FieldType> | undefined
    : FieldType | undefined;
  // Just gives better types to useController
  const controller = useController(context) as any as Omit<
    UseControllerReturn,
    "field"
  > & {
    field: Omit<UseControllerReturn["field"], "value" | "onChange"> & {
      value: FieldType | undefined;
      onChange: (value: OnChangeValue) => void;
    };
  };
  const {
    fieldState,
    field: { onChange },
  } = controller;
  const [isUndefined, setIsUndefined] = useState(false);

  function _onChange(value: OnChangeValue) {
    if (value === undefined) {
      setIsUndefined(true);
      context.addToCoerceUndefined(context.name);
    } else {
      setIsUndefined(false);
      context.removeFromCoerceUndefined(context.name);
      onChange(value);
    }
  }
  return {
    ...controller,
    error: errorFromRhfErrorObject<FieldType>(fieldState.error),
    field: {
      ...controller.field,
      value: isUndefined ? undefined : controller.field.value,
      onChange: _onChange,
    },
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

export function fieldSchemaMismatchHookError(
  hookName: string,
  expectedType: string
) {
  return `Make sure that ${hookName} hook it is being called inside of a custom component which matches the type '${expectedType}'`;
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
  printUseEnumWarning();
  if (!enumValues) throw new Error(enumValuesNotPassedError());
  return enumValues;
}

/**
 * Returns the Zod type for a field.
 *
 * @returns  The Zod type for the field.
 */
export function useFieldZodType() {
  const { zodType } = useContextProt("useFieldZodType");
  return zodType;
}

function getFieldInfo<
  TZodType extends RTFSupportedZodTypes,
  TUnwrapZodType extends UnwrapZodType<TZodType> = UnwrapZodType<TZodType>
>(zodType: TZodType) {
  const { type, _rtf_id } = unwrap(zodType);

  return {
    type: type as TUnwrapZodType,
    zodType,
    uniqueId: _rtf_id ?? undefined,
    isOptional: zodType.isOptional(),
    isNullable: zodType.isNullable(),
  };
}

export function internal_useFieldInfo<
  TZodType extends RTFSupportedZodTypes = RTFSupportedZodTypes,
  TUnwrappedZodType extends UnwrapZodType<TZodType> = UnwrapZodType<TZodType>
>(hookName: string) {
  const { zodType, label, placeholder } = useContextProt(hookName);

  const fieldInfo = getFieldInfo<TZodType, TUnwrappedZodType>(
    zodType as TZodType
  );

  return { ...fieldInfo, label, placeholder };
}

/**
 * Returns schema-related information for a field
 *
 * @returns The Zod type for the field.
 */
export function useFieldInfo() {
  return internal_useFieldInfo("useFieldInfo");
}

export function usePickZodFields<
  TZodKindName extends RTFSupportedZodFirstPartyTypeKind,
  TZodType extends RTFSupportedZodFirstPartyTypeKindMap[TZodKindName] = RTFSupportedZodFirstPartyTypeKindMap[TZodKindName],
  TUnwrappedZodType extends UnwrapZodType<TZodType> = UnwrapZodType<TZodType>,
  TPick extends Partial<
    PickPrimitiveObjectProperties<TUnwrappedZodType, true>
  > = Partial<PickPrimitiveObjectProperties<TUnwrappedZodType, true>>
>(zodKindName: TZodKindName, pick: TPick, hookName: string) {
  const fieldInfo = internal_useFieldInfo<TZodType, TUnwrappedZodType>(
    hookName
  );
  const { type } = fieldInfo;

  if (!isTypeOf(type, zodKindName)) {
    throw new Error(fieldSchemaMismatchHookError(hookName, zodKindName));
  }

  return {
    ...pickPrimitiveObjectProperties<TUnwrappedZodType, TPick>(type, pick),
    ...fieldInfo,
  };
}

/**
 * Returns schema-related information for a ZodString field
 *
 * @example
 * ```tsx
 * const CustomComponent = () => {
 *   const { minLength, maxLength, uniqueId } = useStringFieldInfo();
 *
 *   return <input minLength={minLength} maxLength={maxLength} />;
 * };
 * ```
 * @returns Information for a ZodString field
 */
export function useStringFieldInfo() {
  return usePickZodFields(
    "ZodString",
    {
      isCUID: true,
      isCUID2: true,
      isDatetime: true,
      isEmail: true,
      isEmoji: true,
      isIP: true,
      isULID: true,
      isURL: true,
      isUUID: true,
      maxLength: true,
      minLength: true,
    },
    "useStringFieldInfo"
  );
}

/**
 * Returns schema-related information for a ZodNumber field
 *
 * @returns data for a ZodNumber field
 */
export function useNumberFieldInfo() {
  return usePickZodFields(
    "ZodNumber",
    {
      isFinite: true,
      isInt: true,
      maxValue: true,
      minValue: true,
    },
    "useNumberFieldInfo"
  );
}

const {} = useNumberFieldInfo;
