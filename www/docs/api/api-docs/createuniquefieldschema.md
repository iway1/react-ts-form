---
sidebar_position: 2
---

# createUniqueFieldSchema

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
