import React, {
  InputHTMLAttributes,
  PropsWithChildren,
  useCallback,
} from "react";
import { z } from "zod";
import { createUniqueFieldSchema } from "../../createFieldSchema";
import { createTsForm } from "../../createSchemaForm";
import { useTsController } from "../../FieldContext";

function CheckBox({
  label,
}: Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value"> & {
  label?: string;
}) {
  const { field, error } = useTsController<string>();
  return (
    <div className="border-blue border-1 border  p-4">
      <input
        type="checkbox"
        value={field.value ? field.value : "none"}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      />{" "}
      {label}
      <span>{error?.errorMessage && error.errorMessage}</span>
    </div>
  );
}

function CustomSelect(
  props: Omit<InputHTMLAttributes<HTMLSelectElement>, "name" | "value"> & {
    label?: string;
    customValues: string[];
  }
) {
  const { onChange, onBlur, readOnly, label, customValues, ...spreadProps } =
    props;
  const { field, error } = useTsController<number | string>();
  const handleChange = useCallback<
    Required<InputHTMLAttributes<HTMLSelectElement>>["onChange"]
  >(
    (e) => {
      const val = (e.target as any).value;
      field.onChange(val && typeof val !== "boolean" ? val : undefined);
      onChange?.(e);
    },
    [field.onChange, onChange]
  );
  const handleBlur = useCallback<
    Required<InputHTMLAttributes<HTMLSelectElement>>["onBlur"]
  >(
    (e) => {
      field.onBlur();
      onBlur?.(e);
    },
    [field.onBlur, onBlur]
  );

  return (
    <div className="border-blue border-1 border  p-4">
      <label>{label}</label>
      <select
        value={field.value ? field.value + "" : ""}
        {...(readOnly || props.disabled
          ? {}
          : { onChange: handleChange, onBlur: handleBlur })}
        name={field.name}
        {...spreadProps}
      >
        {customValues.map((x) => (
          <option value={x} key={x}>
            {x}
          </option>
        ))}
      </select>
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}

function Select(
  props: Omit<InputHTMLAttributes<HTMLSelectElement>, "name" | "value"> & {
    label?: string;
    enumValues: string[];
  }
) {
  const { onChange, onBlur, readOnly, label, enumValues, ...spreadProps } =
    props;
  const { field, error } = useTsController<number | string>();
  const handleChange = useCallback<
    Required<InputHTMLAttributes<HTMLSelectElement>>["onChange"]
  >(
    (e) => {
      const val = (e.target as any).value;
      field.onChange(val && typeof val !== "boolean" ? val : undefined);
      onChange?.(e);
    },
    [field.onChange, onChange]
  );
  const handleBlur = useCallback<
    Required<InputHTMLAttributes<HTMLSelectElement>>["onBlur"]
  >(
    (e) => {
      field.onBlur();
      onBlur?.(e);
    },
    [field.onBlur, onBlur]
  );

  return (
    <div className="border-blue border-1 border  p-4">
      <label>{label}</label>
      <select
        value={field.value ? field.value + "" : ""}
        {...(readOnly || props.disabled
          ? {}
          : { onChange: handleChange, onBlur: handleBlur })}
        name={field.name}
        {...spreadProps}
      >
        {enumValues.map((x) => (
          <option value={x} key={x}>
            {x}
          </option>
        ))}
      </select>
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}

function SubmitButton({ children }: PropsWithChildren<{}>) {
  return <button type="submit">{children}</button>;
}

function TextArea(
  props: Omit<InputHTMLAttributes<HTMLTextAreaElement>, "name" | "value"> & {
    label?: string;
  }
) {
  const { onChange, onBlur, readOnly, label, ...spreadProps } = props;
  const { field, error } = useTsController<number | string>();
  const handleChange = useCallback<
    Required<InputHTMLAttributes<HTMLTextAreaElement>>["onChange"]
  >(
    (e) => {
      const val = (e.target as any).value;
      field.onChange(val && typeof val !== "boolean" ? val : undefined);
      onChange?.(e);
    },
    [field.onChange, onChange]
  );
  const handleBlur = useCallback<
    Required<InputHTMLAttributes<HTMLTextAreaElement>>["onBlur"]
  >(
    (e) => {
      field.onBlur();
      onBlur?.(e);
    },
    [field.onBlur, onBlur]
  );

  return (
    <div className="border-blue border-1 border  p-4">
      <label>{label}</label>
      <textarea
        value={field.value ? field.value + "" : ""}
        {...(readOnly || props.disabled
          ? {}
          : { onChange: handleChange, onBlur: handleBlur })}
        readOnly={readOnly || false}
        name={field.name}
        {...spreadProps}
      />
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}

function TextField(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value"> & {
    label?: string;
  }
) {
  console.log("textfieldprops", props);
  const { onChange, onBlur, readOnly, label, ...spreadProps } = props;
  const { field, error } = useTsController<number | string>();
  const handleChange = useCallback<
    Required<InputHTMLAttributes<HTMLInputElement>>["onChange"]
  >(
    (e) => {
      const val = (e.target as any).value;
      field.onChange(val && typeof val !== "boolean" ? val : undefined);
      onChange?.(e);
    },
    [field.onChange, onChange]
  );
  const handleBlur = useCallback<
    Required<InputHTMLAttributes<HTMLInputElement>>["onBlur"]
  >(
    (e) => {
      field.onBlur();
      onBlur?.(e);
    },
    [field.onBlur, onBlur]
  );

  return (
    <div className="border-blue border-1 border  p-4">
      <label>{label}</label>
      <input
        value={field.value ? field.value + "" : ""}
        {...(readOnly || props.disabled
          ? {}
          : { onChange: handleChange, onBlur: handleBlur })}
        readOnly={readOnly || false}
        name={field.name}
        {...spreadProps}
      />
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}

const textAreaStringSchema = createUniqueFieldSchema(z.string(), "TextArea2");
const SelectStringSchema = createUniqueFieldSchema(z.string(), "Select2");

const mapping = [
  [z.string(), TextField] as const,
  [z.enum([""]), Select] as const,
  [textAreaStringSchema, TextArea] as const,
  [z.boolean(), CheckBox] as const,
  [SelectStringSchema, CustomSelect] as const,
] as const;

export const Form = createTsForm(mapping);

const schema = z.object({
  name1: z.string(),
  name2: textAreaStringSchema,
  name3: SelectStringSchema,
  over18: z.boolean(),
  favoriteColor: z.enum(["blue", "red", "purple"]),
});

export const FormExample = () => (
  <Form
    schema={schema}
    onSubmit={(e) => {
      console.log(e);
    }}
    props={{ name3: { customValues: ["1", "2", "3"] } }}
    renderAfter={() => <SubmitButton>Abschicken</SubmitButton>}
  />
);
