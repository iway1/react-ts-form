---
sidebar_position: 3
---

# Error Handling

## Accessing Error Messages in your component

`@ts-react/form` also returns an <code>error</code> object that's more accurately typed than `react-hook-forms`'s that you can use to show errors:

```tsx
function MyComponent() {
  const { error } = useTsController<string>();

  return (
    <div>
      // ... // Normally we conditionally render error messages
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}
```

## Defining Error Messages

Zod schemas make it very easy to create validation steps for your form while also providing an easy way to pass error messages when those steps fail:

```tsx
z.object({
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(1, "Please enter a password.")
    .min(8, "Your password must be at least 8 characters in length")
)}
```

In the above schema, the `email` field is validated as an email because we've called `.email()` on the string schema, the message "Invalid email" will be put into the form state if the user tries to submit. To learn more about the different types of validations you can perform you should consult the [zod](https://github.com/colinhacks/zod) documentation (since zod schemas are what generates the errors for this library).

## Revalidation

The default behavior for this library is that errors will be shown once the user tries to submit, and fields will be revalidated as the value changes (as soon as the user enters a valid email the error message dissapears). Generally this works well but you may want to use some other validation behavior. Check out the [react hook form docs](https://react-hook-form.com/api/useform) and pass a custom `useForm` to your forms `form` prop:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<z.infer<typeof MyFormSchema>>({
  resolver: zodResolver(MyFormSchema),
  reValidateMode: "onSubmit", // now the form revalidates on submit
});

return (
  <Form
    //...
    form={form}
  />
);
```

For more information about dealing with errors (IE imperatively resetiting errors), check out the [hook form docs](https://react-hook-form.com)

## Dealing with collisions

Some times you want multiple types of for the same zod schema type. You can deal with collisions using `createUniqueFieldSchema`:

```tsx
const MyUniqueFieldSchema = createUniqueFieldSchema(
  z.string(),
  "aUniqueId" // You need to pass a string ID, it can be anything but has to be set explicitly and be unique.
);

const mapping = [
  [z.string(), NormalTextField] as const,
  [MyUniqueFieldSchema, UltraTextField] as const,
] as const;

const MyFormSchema = z.object({
  mapsToNormal: z.string(), // renders as a NormalTextField component
  mapsToUnique: MyUniqueTextFieldSchema, // renders as a UltraTextField component.
});
```

## Handling Optionals

`@ts-react/form` will match optionals to their non optional zod schemas:

```tsx
const mapping = [[z.string(), TextField]] as const;

const FormSchema = z.object({
  optionalEmail: z.string().email().optional(), // renders to TextField
  nullishZipCode: z.string().min(5, "5 chars please").nullish(), // renders to TextField
});
```

Your zod-component-mapping should not include any optionals. If you want a reusable optional schema, you can do something like this:

```tsx
const mapping = [[z.string(), TextField]] as const;

export const OptionalTextField = z.string().optional();
```
