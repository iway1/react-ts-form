# Schema Collisions

## Dealing with collisions

Some times you may want to use multiple types for the same zod schema type. You can deal with collisions using `createUniqueFieldSchema`:

```tsx
const PhoneNumberSchema = createUniqueFieldSchema(
  z.string().regex(/[0-9]{10}/, "Please enter a valid phone number"),
  "phone" // You need to pass a string ID, it can be anything but has to be set explicitly and be unique.
);

const mapping = [
  [z.string(), TextField] as const,
  [MyUniqueFieldSchema, PhoneNumberField] as const,
] as const;

const MyFormSchema = z.object({
  mapsToNormal: z.string(), // renders as a NormalTextField component
  mapsToUnique: PhoneNumberSchema, // renders as a UltraTextField component.
});
```

This can allow you to use similar zod schemas for rendering different types of components.

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
