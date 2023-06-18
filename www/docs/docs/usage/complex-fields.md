---
sidebar_position: 5
---

# Complex Field Types

## Complex field types

You can use almost any zod schema and have it map to an appropriate component:

```tsx
function AddressEntryField() {
  const {field: {onChange, value}, error} = useTsController<z.infer<typeof AddressSchema>>();
  const street = value?.street;
  const zipCode = value?.zipCode;
  return (
    <div>
      <input
        value={street}
        onChange={(e)=>{
          onChange({
            ...value,
            street: e.target.value,
          })
        })
      />
      {error?.street && <span>{error.street.errorMessage}</span>}
      <input
        value={zipCode}
        onChange={(e)=>{
          onChange({
            ...value,
            zipCode: e.target.value
          })
        }}
      />
      {error?.zipCode && <span>{error.zipCode.errorMessage}</span>}
    </div>
  )
}

const AddressSchema = z.object({
  street: z.string(),
  zipCode: z.string(),
});

const mapping = [
  [z.string, TextField] as const,
  [AddressSchema, AddressEntryField] as const,
] as const;

const FormSchema = z.object({
  name: z.string(),
  address: AddressSchema, // renders as AddressInputComponent
});
```

## ⚠️ When to use ⚠️

Complex input types are useful when you have reusable input components that have a non-primitive object as its form state. If you only need to build a custom layout, use the [Custom Layouts](./custom-layouts.md) feature of this package.
