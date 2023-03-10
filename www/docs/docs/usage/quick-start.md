---
sidebar_position: 1
---

# Quick Start

## Usage

Create a zod-to-component mapping to map zod schemas to your components then create your form with `createTsForm()` (typically once per project):

```tsx
import { createTsForm } from "@ts-react/form";
import { z } from "zod";

// create the mapping
const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckBoxField],
  [z.number(), NumberField],
] as const; // 👈 `as const` is necessary

// A typesafe React component
const MyForm = createTsForm(mapping);
```

Now just create form schemas with `zod` and pass them to your form:

```tsx
const SignUpSchema = z.object({
  email: z.string().email("Enter a real email please."), // renders TextField
  password: z.string(),
  address: z.string(),
  favoriteColor: z.enum(["blue", "red", "purple"]), // renders DropDownSelect and passed the enum values
  isOver18: z.boolean(), // renders CheckBoxField
});

function MyPage() {
  function onSubmit(data: z.infer<typeof SignUpSchema>) {
    // gets typesafe data when form is submitted
  }

  return (
    <MyForm
      schema={SignUpSchema}
      onSubmit={onSubmit}
      renderAfter={() => <button type="submit">Submit</button>}
      // optional typesafe props forwarded to your components
      props={{
        email: {
          className: "mt-2",
        },
      }}
    />
  );
}
```

That's it! Adding a new field to your form just means adding an additional property to the schema.

It's recommended but not required that you create a custom form component to handle repetitive stuff (like rendering the submit button).
