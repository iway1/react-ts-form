# Access Schema Data

From a custom form component, we're able to access field schema information through a set of hooks.<br/>
This allows components to access information about the type and validation rules of the corresponding form field.


## `useFieldInfo`

Returns schema-related information for any field

```tsx
import { useFieldInfo } from "@ts-react/form";

const MyCustomField = () => {
  const { label, placeholder, isOptional, zodType } = useFieldInfo();
  return (
    <div>
      {label}
      <input placeholder={placeholder} required={!isOptional} />
    </div>
  );
};
```


## `useStringFieldInfo` 

Returns schema-related information for a ZodString field


```tsx
import { useStringFieldInfo } from "@ts-react/form";

const MyStringCustomField = () => {
    
  const { label, placeholder, description, isOptional, minLength, maxLength, zodType } =
    useStringFieldInfo();

  return (
    <div>
      {label}
      <input
        placeholder={placeholder}
        required={!isOptional}
        minLength={minLength}
        maxLength={maxLength}
      />
    </div>
  );
};
```

## `useNumberFieldInfo` 

Returns schema-related information for a ZodNumber field

```tsx
import { useNumberFieldInfo } from "@ts-react/form";

const MyNumberCustomField = () => {
  const { label, placeholder, description, isOptional, minValue, maxValue, isInt, zodType } =
    useNumberFieldInfo();
  return (
    <div>
      {label}
      <input
        placeholder={placeholder}
        required={!isOptional}
        min={minValue}
        max={maxValue}
        step={isInt ? undefined : 0.1}
      />
    </div>
  );
};
```

## `useNumberFieldInfo` 

Returns schema-related information for a ZodNumber field

```tsx
import { useDateFieldInfo } from "@ts-react/form";

const MyDateCustomField = () => {
  const { label, placeholder, description, maxDate, minDate, zodType } =
    useDateFieldInfo();
  return (
    <div>
      {label}
      <input
        placeholder={placeholder}
        required={!isOptional}
        min={minDate?.toISOString().slice(0, 10)}
        max={maxDate?.toISOString().slice(0, 10)}
      />
    </div>
  );
};
```
