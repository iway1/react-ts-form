---
sidebar_position: 9
---

# React Native

This library works the same in React Native as it does in React.

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
