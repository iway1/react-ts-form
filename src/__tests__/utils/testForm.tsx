import React from "react";
import { Control, useController } from "react-hook-form";
import { z } from "zod";
import { createUniqueFieldSchema } from "../../createFieldSchema";
import { createTsForm } from "../../createSchemaForm";
import { useTsController } from "../../FieldContext";

export const textFieldTestId = "text-field";
export const defaultTextInputTestId = "text-input";
export const defaultBooleanInputTestId = "boolean-input";
export const defaultNumberInputTestId = "number-input";
export const errorMessageTestId = "error-message";

export function ErrorMessage() {
  const { error } = useTsController();
  return !error ? null : (
    <div data-testid={errorMessageTestId}>{error?.errorMessage}</div>
  );
}

export function TextField(props: {
  control: Control<any>;
  name: string;
  testId?: string;
  label?: string;
  placeholder?: string;
}) {
  const { label, placeholder } = props;
  const {
    field: { onChange, value },
  } = useController({ control: props.control, name: props.name });

  return (
    <div data-testid={textFieldTestId}>
      {label && <label>{label}</label>}
      <input
        name={props.name}
        data-testid={props.testId || defaultTextInputTestId}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        value={value ? value : ""}
        placeholder={placeholder}
      />
      <ErrorMessage />
    </div>
  );
}

export function BooleanField(props: {
  control: Control<any>;
  name: string;
  testId?: string;
}) {
  const {
    field: { onChange, value },
  } = useController({ control: props.control, name: props.name });
  return (
    <div>
      <input
        name={props.name}
        data-testid={props.testId ?? defaultBooleanInputTestId}
        type="checkbox"
        checked={value}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
      <ErrorMessage />
    </div>
  );
}

export function NumberField(props: {
  control: Control<any>;
  name: string;
  testId?: string;
  suffix?: string;
}) {
  const {
    field: { onChange, value },
  } = useController({ control: props.control, name: props.name });
  return (
    <div>
      <input
        name={props.name}
        data-testid={props.testId ?? defaultNumberInputTestId}
        type="number"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <div>{props.suffix}</div>
      <ErrorMessage />
    </div>
  );
}

export const customFieldTestId = "custom";

function CustomTextField(props: {
  control: Control<any>;
  name: string;
  aCustomField: string;
  testId: string;
}) {
  return (
    <div data-testid={customFieldTestId}>
      <input data-testid={props.testId} />
      <ErrorMessage />
    </div>
  );
}
export const enumFieldValues = ["a", "b", "c"] as const;

function EnumField({
  enumValues = [],
  label,
  placeholder,
}: {
  enumValues?: string[];
  label?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <span>{label}</span>
      <span>{placeholder}</span>
      {enumValues.map((e, i) => (
        <p key={i + ""}>{e}</p>
      ))}
    </div>
  );
}

export const TestCustomFieldSchema = createUniqueFieldSchema(z.string(), "id");

const mapping = [
  [z.string(), TextField] as const,
  [z.boolean(), BooleanField] as const,
  [z.number(), NumberField] as const,
  [TestCustomFieldSchema, CustomTextField] as const,
  [z.enum(enumFieldValues), EnumField] as const,
] as const;

const propsMap = [
  ["name", "name"] as const,
  ["control", "control"] as const,
  ["enumValues", "enumValues"] as const,
  ["descriptionLabel", "label"] as const,
  ["descriptionPlaceholder", "placeholder"] as const,
] as const;

export const TestForm = createTsForm(mapping, {
  propsMap: propsMap,
});

const FormWithSubmit = ({
  children,
  ...props
}: {
  children: JSX.Element[];
  onSubmit: () => void;
}) => (
  <form {...props}>
    {children} <button type="submit">submit</button>
  </form>
);
export const TestFormWithSubmit = createTsForm(mapping, {
  propsMap: propsMap,
  FormComponent: FormWithSubmit,
});
