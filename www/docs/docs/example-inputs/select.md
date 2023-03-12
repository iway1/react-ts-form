# SelectField

```tsx
function Select({ options }: { options: string[] }) {
  const { field, error } = useTsController<string>();
  return (
    <>
      <select
        value={field.value ? field.value : "none"}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      >
        {!field.value && <option value="none">Please select...</option>}
        {options.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      <span>{error?.errorMessage && error.errorMessage}</span>
    </>
  );
}
```
