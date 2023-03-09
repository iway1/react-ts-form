---
sidebar_position: 3
---

# useReqDescription

## `useReqDescription`

Exactly the same as `useDescription`, except it will throw an error if either `label` or `placeholder` is not passed via the `.describe()` syntax. Useful if you want to make sure they're always passed.

```tsx
function TextField() {
  const { label, placeholder } = useReqDescription(); // {label: string, placeholder: string};
  // ...
}

const FormSchema = z.object({
  name: z.string().describe("Name // Please enter your name"),
});
```
