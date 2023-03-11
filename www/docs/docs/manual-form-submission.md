---
sidebar_position: 8
---

# Manual Form Submission

## Submitting the form manually

The default form component as well as a custom form component (if used) will automatically be passed the `onSubmit` function.
Normally, you'll want to pass a button to the `renderAfter` or `renderBefore` prop of the form:

```tsx
<MyForm renderAfter={() => <button type="submit">Submit</button>} />
```

For React Native, or for other reasons, you will need to call `submit` explicitly:

```tsx
<MyForm
  renderAfter={({ submit }) => (
    <TouchableOpacity onPress={submit}>
      <Text>Submit</Text>
    </TouchableOpacity>
  )}
/>
```
