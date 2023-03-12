---
---

# Custom Layouts

## Defining Custom Layouts

`react-ts-form` supports custom layouts for times when we need more than props to achieve the desired style (for example when we want two inputs in the same row).

To build a form with a custom layout, pass a function that returns JSX as the child to your form component, and that function will be passed the form elements as a prop:

```tsx
const FormSchema = z.object({
  fieldOne: z.string(),
  fieldTwo: z.number(),
  fieldThree: z.string(),
});

const MyPage = () => {
  return (
    <MyForm schema={FormSchema}>
      {({ fieldOne, fieldTwo, fieldThree }) => {
        return (
          <>
            {fieldOne}
            <div className="flex-row">
              {fieldTwo}
              {fieldThree}
            </div>
          </>
        );
      }}
    </MyForm>
  );
};
```

This will render your schema fields to the components in the mapping and connect your input components to the form state management as usual, while additionally allowing for building of any JSX layout for your form.

Any JSX should work.

## rest

Additionally, you can render any leftover elements that you haven't unpacked like this:

```tsx
<MyForm>
  {({ fieldOne, fieldTwo, ...rest }) => {
    return (
      <>
        <div className="flex-row">
          {fieldOne}
          {fieldTwo}
        </div>
        {Object.values(rest)}
      </>
    );
  }}
</MyForm>
```
