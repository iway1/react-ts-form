---
sidebar_position: 3
---

# FormComponent

## FormComponent

This is the component returned via `createSchemaForm`

### Props

| **Prop**      | **Req** | **Type**                                   | **Description**                                                                                                                                                         |
| ------------- | ------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| schema        | Yes     | `AnyZodObject`                             | A zod object that will be used to validate your form input.                                                                                                             |
| onSubmit      | Yes     | `(schema: DataType)=>void`                 | A function that will be called when the form is submitted and validated successfully.                                                                                   |
| props         | Maybe   | `Record<string, ComponentProps>`           | props to pass to your components. Will be required if any of your components have required props, optional otherwise.                                                   |
| formProps     | Maybe   | `FormProps`                                | props to pass to your form, typesafe to your form component props.                                                                                                      |
| defaultValues | No      | `DeepPartial<DataType>`                    | Default values for your form.                                                                                                                                           |
| renderAfter   | No      | `({submit}:{submit: ()=>void})=>ReactNode` | A function that returns an element to be rendered after your form inputs, inside the form container. Is passed the `submit` function that will try to submit the form.  |
| renderBefore  | No      | `({submit}:{submit: ()=>void})=>ReactNode` | A function that returns an element to be rendered before your form inputs, inside the form container. Is passed the `submit` function that will try to submit the form. |
| form          | No      | `UseFormReturn`                            | Optionally pass a `react-hook-form` useForm() result so that you can have control of your form state in the parent component.                                           |
