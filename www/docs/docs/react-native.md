---
sidebar_position: 9
---

# React Native Usage

## React Native Usage

React Native requires creating a custom form component:

```tsx
const FormContainer = ({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: () => void;
}) => (
  <View>
    {children}
    <TouchableOpacity onPress={onSubmit}>
      <Text>Submit</Text>
    </TouchableOpacity>
  </View>
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
