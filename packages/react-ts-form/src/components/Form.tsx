import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {FieldContextProvider} from '../providers/FieldContextProvider';

import {FormProps, PropsMapping, SchemaType} from '../types/props';
import {RTFSupportedZodTypes} from '../types/zod';
import {detectDuplicateTypes} from '../utils/detectDuplicateTypes';
import {getComponentForZodType} from '../utils/getComponentForZodType';
import {getMetaInformationForZodType} from '../utils/getMetaInformationForZodType';
import {mapPropsToObject} from '../utils/mapPropsToObject';
import {unwrapEffects} from '../utils/unwrap';

class NoMatchingSchemaError extends Error {
  constructor({
    propertyName,
    propertyType,
  }: {
    propertyName: string;
    propertyType: string;
  }) {
    const data = `No matching zod schema for type \`${propertyType}\` found in mapping for property \`${propertyName}\`. Make sure there's a matching zod schema for every property in your schema.`;
    super(data);
    this.message = data;
  }
}

/**
 * @internal
 */
const defaultPropsMap: PropsMapping = [
  ['name', 'name'] as const,
  ['control', 'control'] as const,
  ['enumValues', 'enumValues'] as const,
] as const;

export const Form = ({
  componentMap,
  defaultValues,
  form,
  formProps,
  onSubmit,
  options,
  props,
  renderAfter,
  renderBefore,
  schema,
}: FormProps) => {
  const FormComponent = options?.FormComponent || 'form';

  detectDuplicateTypes(componentMap.map((e) => e[0]));

  const propsMap = mapPropsToObject(options?.propsMap || defaultPropsMap);

  const useFormResultInitialValue = React.useRef<
    undefined | ReturnType<typeof useForm>
  >(form);

  if (!!useFormResultInitialValue.current !== !!form) {
    throw new Error(
      `useFormResult prop changed - its value shouldn't changed during the lifetime of the component.`,
    );
  }

  const {control, handleSubmit} = (() => {
    if (form) {
      return form;
    }

    const reactForm = useForm({
      resolver: zodResolver(schema),
      defaultValues,
    });

    return reactForm;
  })();

  const _schema = unwrapEffects(schema);
  const shape: Record<string, RTFSupportedZodTypes> = _schema._def.shape();

  function _submit(data: z.infer<SchemaType>) {
    onSubmit(data);
  }

  const submitFn = handleSubmit(_submit);

  return (
    <FormComponent {...formProps} onSubmit={submitFn}>
      {renderBefore && renderBefore({submit: submitFn})}

      {Object.keys(shape).map((key) => {
        const type = shape[key] as RTFSupportedZodTypes;

        const Component = getComponentForZodType(type, componentMap);

        if (!Component) {
          throw new NoMatchingSchemaError({
            propertyName: key,
            propertyType: type._def.typeName,
          });
        }

        const meta = getMetaInformationForZodType(type);

        const fieldProps = props && props[key] ? (props[key] as any) : {};

        const {beforeElement, afterElement} = fieldProps;

        const mergedProps = {
          ...(propsMap.name && {[propsMap.name]: key}),
          ...(propsMap.control && {[propsMap.control]: control}),
          ...(propsMap.enumValues && {
            [propsMap.enumValues]: meta.enumValues,
          }),
          ...(propsMap.descriptionLabel && {
            [propsMap.descriptionLabel]: meta.description?.label,
          }),
          ...(propsMap.descriptionPlaceholder && {
            [propsMap.descriptionPlaceholder]: meta.description?.placeholder,
          }),
          ...fieldProps,
        };

        const {label, placeholder} = meta.description || {};

        return (
          <React.Fragment key={key}>
            {beforeElement}

            <FieldContextProvider
              control={control}
              name={key}
              label={label}
              placeholder={placeholder}
              enumValues={meta.enumValues as string[] | undefined}
            >
              <Component key={key} {...mergedProps} />
            </FieldContextProvider>

            {afterElement}
          </React.Fragment>
        );
      })}
      {renderAfter && renderAfter({submit: submitFn})}
    </FormComponent>
  );
};
