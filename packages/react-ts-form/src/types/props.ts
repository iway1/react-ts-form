import {ComponentProps, ForwardRefExoticComponent, RefAttributes} from 'react';
import {DeepPartial, UseFormReturn} from 'react-hook-form';
import {z} from 'zod';
import {UnwrapZodType} from '../utils/unwrap';

import {IndexOf, RequireKeysWithRequiredChildren} from './generics';
import {RTFBaseZodType, UnwrapEffects} from './zod';

export type MappableProp =
  | 'control'
  | 'name'
  | 'enumValues'
  | 'descriptionLabel'
  | 'descriptionPlaceholder';

export type PropsMapping = readonly (readonly [MappableProp, string])[];

/**
 * @internal
 */
export type ReactProps = Record<string, any>;

/**
 * @internal
 */
export type ReactComponentWithRequiredProps<
  Props extends ReactProps,
  // ExtraProps extends Record<string, any> = {}
> =
  | ((props: Props) => JSX.Element)
  | (ForwardRefExoticComponent<Props> & RefAttributes<unknown>);

export type MappingItem<PropType extends ReactProps> = readonly [
  RTFBaseZodType,
  ReactComponentWithRequiredProps<PropType>,
];

export type SchemaType = z.AnyZodObject | z.ZodEffects<any, any>;

/**
 * @internal
 */
export type FormComponent = 'form' | ((props: any) => JSX.Element);

export type FormComponentMapping = readonly MappingItem<any>[];

export type FormComponentProps = RequireKeysWithRequiredChildren<{
  /**
   * Props to pass to the individual form components. The keys of `props` will be the names of your form properties in the form schema, and they will
   * be typesafe to the form components in the mapping passed to `createTsForm`. If any of the rendered form components have required props, this is required.
   * @example
   * ```tsx
   * <MyForm
   *  schema={z.object({field: z.string()})}
   *  props={{
   *    field: {
   *      // TextField props
   *    }
   *  }}
   * />
   * ```
   */
  props?: RequireKeysWithRequiredChildren<
    Partial<{
      [key in keyof z.infer<SchemaType>]: FormComponentMapping[IndexOf<
        FormComponentMapping,
        readonly [
          UnwrapZodType<
            ReturnType<UnwrapEffects<SchemaType>['_def']['shape']>[key]
          >,
          any,
        ]
      >] extends readonly [any, any] // I guess this tells typescript it has a second element? errors without this check.
        ? Omit<
            React.ComponentProps<
              FormComponentMapping[IndexOf<
                FormComponentMapping,
                readonly [
                  UnwrapZodType<
                    ReturnType<UnwrapEffects<SchemaType>['_def']['shape']>[key]
                  >,
                  any,
                ]
              >][1]
            >,
            PropsMapping[number][1]
          > & {
            /**
             * An element to render after the field.
             */
            afterElement?: React.ReactNode;
            /**
             * An element to render before the field.
             */
            beforeElement?: React.ReactNode;
          }
        : never;
    }>
  >;
}>;

export type FormProps = {
  /**
   * An array mapping zod schemas to components.
   * @example
   * ```tsx
   * const mapping = [
   *  [z.string(), TextField] as const
   *  [z.boolean(), CheckBoxField] as const
   * ] as const
   *
   * const MyForm = createTsForm(mapping);
   * ```
   */
  componentMap: FormComponentMapping;
  /**
   * Initializes your form with default values. Is a deep partial, so all properties and nested properties are optional.
   */
  defaultValues?: DeepPartial<z.infer<UnwrapEffects<SchemaType>>>;
  /**
   * Use this if you need access to the `react-hook-form` useForm() in the component containing the form component (if you need access to any of its other properties.)
   * This will give you full control over you form state (in case you need check if it's dirty or reset it or anything.)
   * @example
   * ```tsx
   * function Component() {
   *   const form = useForm();
   *   return <MyForm useFormResult={form}/>
   * }
   * ```
   */
  form?: UseFormReturn<z.infer<SchemaType>>;
  /**
   * A callback function that will be called with the data once the form has been submitted and validated successfully.
   */
  onSubmit: (values: z.infer<UnwrapEffects<SchemaType>>) => void;
  /**
   * A function that renders components after the form, the function is passed a `submit` function that can be used to trigger
   * form submission.
   * @example
   * ```tsx
   * <Form
   *   // ...
   *   renderAfter={({submit})=><button onClick={submit}>Submit</button>}
   * />
   * ```
   */
  /**
   * Options to customize your form.
   */
  options?: {
    /**
     * The component to wrap your fields in. By default, it is a `<form/>`.
     * @example
     * ```tsx
     * function MyCustomFormContainer({children, onSubmit}:{children: ReactNode, onSubmit: ()=>void}) {
     *  return (
     *    <form onSubmit={onSubmit}>
     *      {children}
     *      <button>Submit</button>
     *    </form>
     *  )
     * }
     * const MyForm = createTsForm(mapping, {
     *  FormComponent: MyCustomFormContainer
     * })
     * ```
     */
    FormComponent?: FormComponent;
    /**
     * Modify which props the form control and such get passed to when rendering components. This can make it easier to integrate existing
     * components with `@ts-react/form` or modify its behavior. The values of the object are the names of the props to forward the corresponding
     * data to.
     * @default {
     *  name: "name",
     *  control: "control",
     *  enumValues: "enumValues",
     * }
     * @example
     * ```tsx
     * function MyTextField({someControlProp}:{someControlProp: Control<any>}) {
     *  //...
     * }
     *
     * const createTsForm(mapping, {
     *  propsMap: {
     *    control: "someControlProp"
     *  }
     * })
     * ```
     */
    propsMap?: PropsMapping;
  };
  renderAfter?: (vars: {submit: () => void}) => React.ReactNode;
  /**
   * A function that renders components before the form, the function is passed a `submit` function that can be used to trigger
   * form submission.
   * @example
   * ```tsx
   * <Form
   *   // ...
   *   renderBefore={({submit})=><button onClick={submit}>Submit</button>}
   * />
   * ```
   */
  renderBefore?: (vars: {submit: () => void}) => React.ReactNode;
  /**
   * A Zod Schema - An input field will be rendered for each property in the schema, based on the mapping passed to `createTsForm`
   */
  schema: SchemaType;
} & RequireKeysWithRequiredChildren<{
  /**
   * Props to pass to the form container component (by default the props that "form" tags accept)
   */
  formProps?: Omit<ComponentProps<FormComponent>, 'children' | 'onSubmit'>;
}> &
  FormComponentProps;
