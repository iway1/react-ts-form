---
sidebar_position: 5
---

# Complex Field Types

## Complex field types

You can use most any zod schema and have it map to an appropriate component:

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

<p align="center">This allows you to build stuff like this when your designer decides to go crazy:</p>

<p align="center">
  <img width="60%" src="https://user-images.githubusercontent.com/12774588/210149773-e680c127-9865-4ea1-9b82-1b7e2244c0ef.png"/>
</p>
