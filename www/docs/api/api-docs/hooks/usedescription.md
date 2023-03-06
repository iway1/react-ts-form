---
sidebar_position: 2
---

# useDescription

## `useDescription`

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
