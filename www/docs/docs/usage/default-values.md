# Default values

You can provide typesafe default values to your form like this:

```tsx
const Schema = z.object({
  string: z.string(),
  num: z.number()
})
//...
<MyForm
  schema={Schema}
  defaultValues={{
    string: 'default',
    num: 5
  }}
/>
```
