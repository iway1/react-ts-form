# Quick Start

## Installation

Make sure you have <code>"strict": true</code> in your `tsconfig.json` `compilerOptions` and make sure you set your editors [typescript version to v4.9 or above](https://github.com/iway1/react-ts-form#typescript-versions) (or intellisense won't be as reliable).

Install package and dependencies with your preferred package manager:

### Install package

```bash
npm install @ts-react/form
```

### Required peer dependencies

```bash
npm install zod react-hook-form @hookform/resolvers
```

Or use yarn / pnpm

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

It's highly recommended that you [create a custom form component](./form-components.md) to handle repetitive stuff (like rendering the submit button).
