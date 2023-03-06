---
sidebar_position: 2
---

# Input Components

## Creating a custom input component

Form components can be any react component. The <code>useTsController()</code> hook allows you to build your components with the form state:

```tsx
function TextField() {
  const { field, error } = useTsController<string>();
  return (
    <>
      <input
        value={field.value ? field.value : ""} // conditional to prevent "uncontrolled to controlled" react warning
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      />
      {error?.errorMessage && <span>{error?.errorMessage}</span>}
    </>
  );
}
```

<code>@ts-react/form</code> will magically connecting your component to the appropriate field with this hook.

## Passing control and name to props

You can also receive the control and name as props, if you prefer:

```tsx
function TextField({ control, name }: { control: Control<any>; name: string }) {
  const { field, fieldState } = useController({ name, control });
  //...
}
```

This approach is less typesafe than <code>useTsController</code>.

If you want the control, name, or other @ts-react/form data to be passed to props with a different name check out prop forwarding.
