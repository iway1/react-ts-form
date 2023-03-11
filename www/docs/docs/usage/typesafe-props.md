---
sidebar_position: 3
---

# Typesafe Props

## Typesafety on component props

Based on your component mapping, <code>@ts-react/form</code> knows which field should receive which props:

```tsx
const mapping = [
  [z.string(), TextField] as const,
  [z.boolean(), CheckBoxField] as const,
] as const;

//...
const Schema = z.object({
  name: z.string(),
  password: z.string(),
  over18: z.boolean(),
})
//...
<MyForm
  props={{
    name: {
      // TextField props
    },
    over18: {
      // CheckBoxField props
    }
  }}
/>
```

## Required props

`@ts-react/form` is also aware of which props are required, so it will make sure you always pass required props to your components:

![Required Props](https://user-images.githubusercontent.com/12774588/210124307-c456ec95-ed9e-47fe-b6f5-a4e7327aab85.png)

Here we get an error because `<Component/>` requires the prop required, and we didn't pass it.

```tsx
return (
  <Form
    schema={FormSchema}
    onSubmit={() => {}}
    props={{
      field: {
        required: "Fixed!",
      },
    }}
  />
);
```

Fixed! We get all the same typesafety of writing out the full jsx.
