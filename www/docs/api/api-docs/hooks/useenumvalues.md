---
sidebar_position: 4
---

# useEnumValues

## `useEnumValues` (**deprecated**, don't use)

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
