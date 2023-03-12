# CheckBox

```tsx
function Checkbox({ name }: { name: string }) {
  const {
    field: { onChange, value },
  } = useTsController<boolean>();

  return (
    <label>
      {name}
      <input
        onChange={(e) => onChange(e.target.checked)}
        checked={value ? value : false}
        type="checkbox"
      />
    </label>
  );
}
```
