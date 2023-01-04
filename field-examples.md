# Example Fields

These can be a good starting points for how to implement certain types of fields.

1. [Select](#select)

## Select

```tsx
function Select({
  options
} : {
  options: {
    label: string,
    id: string,
  }[]
}) {
  const {field, error} = useTsController<string>();
  return (
    <>
      <select
        value={field.value?field.value:'none'}
        onChange={(e)=>{
          field.onChange(e.target.value);
        }}
      >
        {!field.value && <option value="none">Please select...</option>}
        {options.map((e) => (
          <option value={e.id}>{e.label}</option>
        ))}
      </select>
      <span>
        {error?.errorMessage && error.errorMessage}
      </span>
    <>
  );
}

const mapping = [
  // z.number() is also viable. You may have to use "createUniqueFieldSchema" (since you probably already have a Text Field)
  [z.string(), DropDownSelect],
] as const;

const MyForm = z.object({
  eyeColor: z.enum(["blue", "brown", "green", "hazel"]),
  favoritePants: z.enum(["jeans", "khakis", "none"]),
});
```
