# API

- [createTsForm](#createtsform)
- [createUniqueFieldSchema](#createuniquefieldschema)
- [FormComponent](#formcomponent)
- [Hooks](#hooks)

## createTsForm

Create schema form creates a typesafe reusable form component based on your zod-to-component mapping.

```ts
const Form = createTsForm(mapping, options);
```

Typically you'll do this once per project, as the mapping can map any number of schemas to any number of components.

### createTsForm params

**mapping** - A zod-to-component mapping. An array of two-tuples where the first element is a zod schema and the second element is a React functional component:

```ts
const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckboxField],
] as const;
```

The zod schema on the left determines which properties in your form schemas get mapped to which components:

```tsx
const FormSchema = z.object({
  name: z.string(), // Maps to TextField
  isOver18: z.boolean(), // Maps to CheckBoxField
});
```

You can use any zod schema. Objects get matched based on their properties.

**options** - (**optional**) Allows further customization of the form:

```tsx
const Form = createTsForm(mapping, {
  FormComponent: CustomFormComponent,
  propsMap: [["name", "someOtherPropName"]] as const,
});
```

- **options.FormComponent** - (**optional**)A custom form component to use as the container for your field components. Defaults to an html "form". It will be passed a "onSubmit" and "children" prop and should render the children:

  ```tsx
  function FormContainer({
    children,
    onSubmit,
  }: {
    children: ReactNode;
    onSubmit: () => void;
  }) {
    return (
      <form onSubmit={onSubmit}>
        {children}
        <button>Submit</button>
      </form>
    );
  }

  const MyForm = createTsForm(mapping, {
    FormComponent: FormContainer,
  });
  ```

  - **options.propsMap** - (**optional**) Controls which props get passed to your component as well as allows customizing their name. An array of tuples where the first element is a the name of a **mappable prop**, and the second element is the name of the prop you want it forwarded too. Any elements not included in the array will not be passed to input components, and you will not be able to pass any props included on the right hand side to your components via the `props` prop from the `Form` component.

  ```ts
  function MyComponent({
    myCustomPropName,
    myCustomControlName,
  }: {
    myCustomPropName: string; // receives name
    myCustomControlName: string; // receives control
  }) {
    //...
  }
  const propsMap = [
    ["name", "myCustomPropName"],
    ["control", "myCustomControlName"],
  ];
  const componentMap = [[z.string(), MyComponent]] as const;

  const Form = createTsForm(componentMap, {
    propsMap,
  });
  ```

  Defaults to:

  ```ts
  [
    ["name", "name"],
    ["control", "control"],
    ["enumValues", "enumValues"],
  ];
  ```

  Mappable props are:

  - `name` - the name of the input (the property name in your zod schema).
  - `control` - the react hook form control
  - `enumValues` - (**deprecated**) `enumValues` extracted from your zod enum schema.
  - `label` - The label extracted from `.describe()`
  - `placeholder` - The placeholder extracted from `.describe()`

This can be useful in cases where you would like to integrate with existing components, or just don't want `@ts-react/form` to forward any props for you.

## createUniqueFieldSchema

This is useful when dealing with multiple schemas of the same type that you would like to have mapped to different components:

```tsx
const BigTextFieldSchema = createUniqueFieldSchema(z.string(), "id"); // need to pass a unique string literal

const mapping = [
  [z.string(), TextField],
  [BigTextFieldSchema, BigTextField],
] as const;

const FormSchema = z.object({
  name: z.string(), // renders as TextField
  bigName: BigTextFieldSchema, // renders as BigTextField
});
```

## FormComponent

This is the component returned via `createSchemaForm`

### Props

| **Prop**      | **Req** | **Type**                                 | **Description**                                                                                                                                                             |
| ------------- | ------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| schema        | Yes     | AnyZodObject                             | A zod object that will be used to validate your form input.                                                                                                                 |
| onSubmit      | Yes     | (schema: DataType)=>void                 | A function that will be called when the form is submitted and validated successfully.                                                                                       |
| props         | Maybe   | Record<string, ComponentProps>           | props to pass to your components. Will be required if any of your components have required props, optional otherwise.                                                       |
| formProps     | Maybe   | FormProps                                | props to pass to your form, typesafe to your form component props.                                                                                                          |
| defaultValues | No      | DeepPartial<DataType>                    | Default values for your form.                                                                                                                                               |
| renderAfter   | No      | ({submit}:{submit: ()=>void})=>ReactNode | A function that returns an element to be rendered after your form inputs, inside the form container. Is passed the <br>`submit` function that will try to submit the form.  |
| renderBefore  | No      | ({submit}:{submit: ()=>void})=>ReactNode | A function that returns an element to be rendered before your form inputs, inside the form container. <br>Is passed the `submit` function that will try to submit the form. |
| form          | No      | UseFormReturn                            | Optionally pass a `react-hook-form` useForm() result so that you can have control of your form state in the parent component.                                               |

## Hooks

### `useTsController`

A typesafe hook that automatically connects to your form state:

```tsx
function TextField() {
  const {
    field: { onChange, value },
    error,
  } = useTsController<string>();
  // ...
}
```

Returns everything that `react-hook-form`'s [useController](https://react-hook-form.com/api/usecontroller) returns plus an extra `error` object and slightly modified typings to make the form state more intuitive to work with.

### `useDescription`

Returns the `label` and `placeholder` extracted from a call to `.describe()`:

```tsx
function TextField() {
  const { label, placeholder } = useDescription(); // {label?: string, placeholder?: string};
  // ...
}

const FormSchema = z.object({
  name: z.string().describe("Name // Please enter your name"),
});
```

Note you can also pass labels and placeholders and normal react props if you prefer.

### `useReqDescription`

Exactly the same as `useDescription`, except it will throw an error if either `label` or `placeholder` is not passed via the `.describe()` syntax. Useful if you want to make sure they're always passed.

### `useEnumValues` (**deprecated**, don't use)

Returns enum values passed to `z.enum()` for the field that's being rendered:

```tsx
function MyDropdown() {
  const values = useEnumValues(); // ['red', 'green', 'blue']
  return (
    <select>
      {values.map((e) => {
        //...
      })}
    </select>
  );
}
const FormSchema = z.object({
  favoriteColor: z.enum(["red", "green", "blue"]),
});
```
