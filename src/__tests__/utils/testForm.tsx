import React from "react";
import { Control } from "react-hook-form";
import { z } from "zod";
import { createFieldSchema } from "../../createFieldSchema";
import { createSchemaForm } from "../../createSchemaForm";

export const textFieldTestId = "text-field";

function TextField(props: {
  control: Control<any>;
  name: string;
  testId?: string;
  label?: string;
  placeholder?: string;
}) {
  const { label, placeholder } = props;
  return (
    <div data-testid={textFieldTestId}>
      {label && <label>{label}</label>}
      <input data-testid={props.testId} placeholder={placeholder} />
    </div>
  );
}

function BooleanField(props: {
  control: Control<any>;
  name: string;
  testId: string;
}) {
  return <input data-testid={props.testId} />;
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
    </div>
  );
}

export const TestCustomFieldSchema = createFieldSchema(z.string(), "id");

const mapping = [
  [z.string(), TextField] as const,
  [z.boolean(), BooleanField] as const,
  [TestCustomFieldSchema, CustomTextField] as const,
] as const;

export const TestForm = createSchemaForm(mapping);
