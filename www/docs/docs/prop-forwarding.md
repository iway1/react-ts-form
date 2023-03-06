---
sidebar_position: 10
---

# Prop Forwarding

## Forwarding props to the form component

Prop forwarding is an advanced feature that allows you to control which props `@ts-react/form` forward to your components as well as the name.

You probably don't need to use this especially when building a project from scratch, but it can allow more customization. This can be useful for integrating with existing components, or for creating a selection of components that can be used both with and without `@ts-react/form`.

For example, if I wanted the react hook form control to be forwarded to a prop named `floob` I would do:

```tsx
const propsMap = [
  ["control", "floob"] as const,
  ["name", "name"] as const,
] as const;

function TextField({ floob, name }: { floob: Control<any>; name: string }) {
  const { field, fieldState } = useController({ name, control: floob });
}

const componentMap = [[z.string(), TextField] as const] as const;

const MyForm = createTsForm(componentMap, {
  propsMap: propsMap,
});
```

Props that are included in the props map will no longer be passable via the `props` prop of the form. So if you don't want to forward any props to your components (and prefer just using hooks), you can pass an empty array. _Any data that's not included in the props map will no longer be passed to your components_
