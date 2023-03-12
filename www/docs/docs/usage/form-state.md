---
sidebar_position: 4
---

# Accessing Form State

## Form State

Sometimes you need to work with the form directly (such as to reset the form from the parent). In these cases, just pass the `react-hook-form` `useForm()` result to your form:

```tsx
function MyPage() {
  // Need to type the useForm call accordingly
  const form = useForm<z.infer<typeof FormSchema>>();
  const { reset } = form;
  return (
    <Form
      form={form}
      schema={FormSchema}
      // ...
    />
  );
}
```
