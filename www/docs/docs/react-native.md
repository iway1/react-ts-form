---
sidebar_position: 9
---

# React Native Usage

## React Native Usage

For now React Native will require you to provide your own custom form component. The simplest way to do it would be like:

```tsx
const FormContainer = ({ children }: { children: ReactNode }) => (
  <View>{children}</View>
);

const mapping = [
  //...
] as const;

const MyForm = createTsForm(mapping, { FormComponent: FormContainer });
```

## Default values

You can provide typesafe default values like this:

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
