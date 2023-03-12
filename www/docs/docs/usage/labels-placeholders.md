---
sidebar_position: 12
---

# Labels And Placeholders

## Quick Labels / Placeholders

`@ts-react/form` provides a way to quickly add labels / placeholders via `zod`'s `.describe()` method:

```tsx
const FormSchema = z.object({
  // label="Field One", placeholder="Please enter field one...."
  fieldOne: z.string().describe("Field One // Please enter field one..."),
});
```

The `//` syntax separates the label and placeholder. `@ts-react/form` will make these available via the `useDescription()` hook:

```ts
function TextField() {
  const { label, placeholder } = useDescription();
  return (
    <>
      <label>{label}</label>
      <input placeholder={placeholder} />
    </>
  );
}
```

This is just a quicker way to pass labels / placeholders, but it also allows you to reuse placeholder / labels easily across forms:

```tsx
const MyTextFieldWithLabel = z.string().describe("label");

const FormSchemaOne = z.object({
  field: MyTextFieldWithLabel,
});

const FormSchemaTwo = z.object({
  field: MyTextFieldWithLabel,
});
```

If you prefer, you can just pass label and placeholder as normal props via `props`.
