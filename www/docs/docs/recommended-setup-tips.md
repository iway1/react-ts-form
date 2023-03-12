# Recommended Setup Tips

## Tips

For most projects, the following approach will work well

## Tip 1. Create a custom form component

Creating a custom form container is recommended for DRYness. For example:

```tsx
function FormContainer({
  onSubmit,
  children,
  loading,
}: {
  onSubmit: () => void;
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {children}
      <Button className="mt-4 w-full" type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  );
}

// Make sure to pass it to `createTsForm`
const Form = createTsForm(mapping, { FormComponent: FormContainer });
```

The above form component has a "loading" prop to show a loading spinner while the form is submitting to make it easy for us to code a great UX. Also notice the form component has a `space-y-4`, ensuring consistent spacing between form components.

## 2. Consider creating custom components per text field type

There are many different types of text fields we may want to implement. For example, a phone input might behave differently than a password input. If you're buildling custom behavior per input types, consider using a different Schema per input:

```tsx
const PhoneSchema = createUniqueFieldSchema(
  z.string().regex(/[0-9]{10}/),
  "phone"
);
const PasswordSchema = createUniqueFieldSchema(
  z.string().min(8, "Must be 8 characters in length"),
  "password"
);

const mapping = [
  [z.string(), TextField],
  [PhoneSchema, PhoneField],
  [PasswordSchema, PasswordField],
] as const;
```

### Component Composition / Wrapper Components

Since we probably want to share some styling and such across these similar types of fields, we can use a base controlled component as a child of the components passed to the mapping, and the components passed to the mapping would be "wrappers" for this inner base text field component:

```tsx
function TextFieldBase({
  label,
  value,
  onChange,
  error,
  inputProps,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  inputProps?: Omit<ComponentProps<"input">, "onChange" | "value">;
}) {
  <div>
    <label>{label}</label>
    <input
      className={/* custom input styles*/}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      {...inputProps}
    />
    <span>{error}</span>
  </div>;
}

function TextField() {
  const {
    field: { onChange, value },
    error,
  } = useTsController<string>();
  const { label } = useDescription();

  return (
    <TextFieldBase
      value={value}
      onChange={onChange}
      label={label}
      error={error?.errorMessage}
    />
  );
}

function PhoneField() {
  const {
    field: { onChange, value },
    error,
  } = useTsController<string>();
  const { label } = useDescription();

  return (
    <TextFieldBase
      value={maskPhone(value)}
      onChange={(value) => onChange(unmaskPhone)}
      label={label}
      error={error?.errorMessage}
    />
  );
}
```

In simple cases this may not be necessary, and may be easier to just pass props to the same TextField component. But if the input components are very different from eachother, we can save passing a lot of props by creating these types of wrappers. If you're using a component library like MUI or Mantine, you likely won't need to define `TextFieldBase` yourself, and should instead use the TextField component from the component library
