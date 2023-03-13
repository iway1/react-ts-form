# Form Components

## Props

By default your form is just rendered with a `<form>` tag. You can pass props to it via `formProps`:

```tsx
<MyForm
  formProps={{
    ariaLabel: "label",
  }}
/>
```

## Custom Form Component

The recommended approach is to provide a custom form component as the second parameter to `createTsForm` options, it will get passed an `onSubmit` function, and it should also render its children (these are your input components):

```tsx
const mapping = [
  //...
] as const

function MyCustomFormComponent({
  children,
  onSubmit,
  aThirdProp,
}:{
  children: ReactNode,
  onSubmit: ()=>void,
  aThirdProp: string,
}) {
  return (
    <form onSubmit={onSubmit}>
      <img src={"https://picsum.photos/200"} className="w-4 h-4">
      {/* children is you form field components */}
      {children}
      <button type="submit">submit</button>
    </form>
  )
}
// MyCustomFormComponent is now being used as the container instead of the default <form> tag.
const MyForm = createTsForm(mapping, {FormComponent: MyCustomFormComponent});

<MyForm
  formProps={{
    // formProps is typesafe to your form component's props (and will be required if there is
    // required prop).
    aThirdProp: "prop"
  }}
/>
```

## Accessing the react-hook-form prop

If you need to access the `react-hook-form` form prop (what's returned from `useForm`), you can use `useFormContext` exported from `react-hook-form`:

```tsx
import {useFormContext} from 'react-hook-form';

function MyCustomFormComponent({
  children,
  onSubmit,
}:{
  children: ReactNode,
  onSubmit: ()=>void,
}) {
  const form = useFormContext();
  //...
}
```
