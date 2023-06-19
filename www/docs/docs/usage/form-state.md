---
sidebar_position: 4
---

# Accessing Form State

## Form State

Sometimes you need to work with the form directly (such as to reset the form from the parent). In these cases, just pass the `react-hook-form` `useForm()` result to your form:

```tsx
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

const FormSchema = z.object({
  myTextField: z.string().min(10, 'must be 10 in length')
})

function MyPage() {
  // Need to type the useForm call accordingly
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });
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

Notice we have to import `zodResolver` and pass it as the resolver to useForm in order to have our form be validated properly (this is something the library normally does internally).
