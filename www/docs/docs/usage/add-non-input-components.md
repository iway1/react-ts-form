---
sidebar_position: 6
---

# Non-Input Components

## Adding non input components into your form

Some times you need to render components in between your fields (maybe a form section header). In those cases there are some extra props that you can pass to your fields `beforeElement` or `afterElement` which will render a `ReactNode` before or after the field:

```tsx
<MyForm
  schema={z.object({
    field: z.string(),
  })}
  props={{
    field: {
      beforeElement: <span>Renders Before The Input</span>,
      afterElement: <span>Renders After The Input</span>,
    },
  }}
/>
```

Or you can use the [custom layouts feature](./custom-layouts.md)
