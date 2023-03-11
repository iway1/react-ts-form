![banner](https://user-images.githubusercontent.com/12774588/210178528-2eb928f9-fbad-414b-9f69-a57550d05363.png)

<p align="center">Build maintainable, typesafe forms faster 🏃💨</p>

<p align="center">
  
  <img src="https://user-images.githubusercontent.com/12774588/210157220-e287cfdf-c26f-4169-a944-ac147cb4b058.gif"/>

</p>

<p align="center">
<b>@ts-react/form</b> handles the boilerplate involved when building forms using <b>zod</b> and <b>react-hook-form</b> without&nbsp;sacrificing&nbsp;customizability. 
</p>

<div align="center">

<a href=""> [![codecov](https://codecov.io/github/iway1/react-ts-form/branch/main/graph/badge.svg?token=U4UFRGI3HF)](https://codecov.io/github/iway1/react-ts-form) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/isaac_ts_way.svg?style=social&label=Follow%20%40isaac_ts_way)](https://twitter.com/isaac_ts_way)</a>

</div>

# Features

- 🥹 Automatically generate typesafe forms with `zod` schemas
- 📎 Eliminate repetitive jsx and zod/rhf boilerplate
- 🎮 Full control of components via [typesafe props](#typesafe-props)
- 🤯 Headless UI that can render any react component
- ❤️ [Quality Of Life / Productivity](#qol) features not feasible in vanilla `zod` and `react-hook-form`
- 🤌🏻 Very tiny utility library (~3kb gzipped)
- 👀 Great test coverage

[Docs](https://react-ts-form.com/)

[Input Field Examples](field-examples.md)

# Quick Start

## Installation

Make sure you have `"strict": true` in your tsconfig.json compilerOptions and make sure you set your editors [typescript version to v4.9](#typescript-versions) (or intellisense won't be as reliable).

Install package and dependencies with your preferred package manager:

```sh
yarn add @ts-react/form

# required peer dependencies
yarn add zod react-hook-form @hookform/resolvers
```

## Usage

Create a zod-to-component mapping to map zod schemas to your components then create your form with `createTsForm` (typically once per project):

```tsx
// create the mapping
const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckBoxField],
  [z.number(), NumberField],
] as const; // 👈 `as const` is necessary

// A typesafe React component
const MyForm = createTsForm(mapping);
```

Now just create form schemas with zod and pass them to your form:

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

It's recommended but not required that you create a custom [form component](#customizing-form-components) to handle repetitive stuff (like rendering the submit button).

## Full Documentation

You can read the full docs [here](https://react-ts-form.com)

## TypeScript versions

Older versions of typescript have worse intellisense and may not show an error in your editor. Make sure your editors typescript version is set to v4.9 plus. The easiest approach is to upgrade your typescript globally if you haven't recently:

```sh
sudo npm -g upgrade typescript
```

Or, in VSCode you can do (Command + Shift + P) and search for "Select Typescript Version" to change your editors Typescript Version:

![Screenshot 2023-01-01 at 10 55 11 AM](https://user-images.githubusercontent.com/12774588/210178740-edafa8d1-5a69-4e36-8852-c0a01f36c35d.png)

Note that you can still compile with older versions of typescript and the type checking will work.

## Limitations

- Doesn't support class components
- `@ts-react/form` does not yet support "dependent field props", meaning you can't change one field component based on the value of another, but it's a feature we plan on adding soon.
