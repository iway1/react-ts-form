# Example Fields

These can be a good starting points for your fields with `@ts-react/form`

1. [Select](#select)
2. [Text Field](#text-field)
3. [Number Field](#number-field)
4. [Checkbox](#checkbox)
5. [Multi Checkbox](#multi-checkbox)

## Select

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

const mapping = [
  // z.number() is also viable. You'll probably have to use "createUniqueFieldSchema" (since you probably already have a Text Field)
  [z.string(), DropDownSelect],
] as const;

const MyForm = z.object({
  eyeColor: z.string(),
  favoritePants: z.string(),
});

function MyPage() {
  return (
    <Form
      schema={MyForm}
      onSubmit={() => {}}
      renderAfter={() => <button>Submit</button>}
      props={{
        eyeColor: {
          options: ["blue", "red", "green"],
        },
        favoritePants: {
          options: ["khakis", "blue jeans"],
        },
      }}
    />
  );
}
```

## Text Field

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

## Number Field

```tsx
function NumberField({ req }: { req: number }) {
  const {
    field: { onChange, value },
    error,
  } = useTsController<number>();
  return (
    <>
      <span>
        <span>{`req is ${req}`}</span>
        <input
          value={value !== undefined ? value + "" : ""}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value)) onChange(undefined);
            else onChange(value);
          }}
        />
        {error && error.errorMessage}
      </span>
    </>
  );
}
```

## Checkbox

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

## Multi Checkbox

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
