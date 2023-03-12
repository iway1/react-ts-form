---
sidebar_position: 2
---

# Creating Components

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

<code>@ts-react/form</code> will magically connect your component to the appropriate field with this hook.
