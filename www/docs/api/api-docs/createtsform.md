---
sidebar_position: 1
---

# createTsForm

## createTsForm

Create schema form creates a typesafe reusable form component based on your zod-to-component mapping.

```ts
const Form = createTsForm(mapping, options);
```

Typically you'll do this once per project, as the mapping can map any number of schemas to any number of components.

## createTsForm Parameters

### **mapping**

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

### **options**

**options** - (**optional**) Allows further customization of the form:

```tsx
const Form = createTsForm(mapping, {
  FormComponent: CustomFormComponent,
  propsMap: [["name", "someOtherPropName"]] as const,
});
```

### **options.FormComponent**

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

### **options.propsMap**

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
