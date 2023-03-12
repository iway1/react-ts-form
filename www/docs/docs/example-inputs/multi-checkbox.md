# MultiCheckBox

```tsx
function MultiCheckbox({ options }: { options: string[] }) {
  const {
    field: { onChange, value },
  } = useTsController<string[]>();

  function toggleField(option: string) {
    if (!value) onChange([option]);
    else {
      onChange(
        value.includes(option)
          ? value.filter((e) => e !== option)
          : [...value, option]
      );
    }
  }

  return (
    <>
      {options.map((optionValue) => (
        <label
          htmlFor={optionValue}
          style={{ display: "flex", flexDirection: "row" }}
          key={optionValue}
        >
          {optionValue}
          <input
            name={optionValue}
            type="checkbox"
            onChange={() => toggleField(optionValue)}
            checked={value?.includes(optionValue) ? true : false}
          />
        </label>
      ))}
    </>
  );
}
```
