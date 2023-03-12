# TextField

```tsx
function TextField() {
  const {
    field: { onChange, value },
    error,
  } = useTsController<string>();

  return (
    <>
      <input
        onChange={(e) => onChange(e.target.value)}
        value={value ? value : ""}
      />
      {error && error.errorMessage}
    </>
  );
}
```
