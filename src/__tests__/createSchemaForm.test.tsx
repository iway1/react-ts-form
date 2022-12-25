import React from "react";
import { z } from "zod";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  customFieldTestId,
  TestCustomFieldSchema,
  TestForm,
  textFieldTestId,
} from "./utils/testForm";
import { noMatchingSchemaErrorMessage } from "../createSchemaForm";
import { SPLIT_DESCRIPTION_SYMBOL } from "../getMetaInformationForZodType";

const testIds = {
  textField: "_text-field",
  textFieldTwo: "_text-field-2",
  booleanField: "_boolean-field",
};

describe("createSchemaForm", () => {
  it("should render a text field and a boolean field based on the mapping and schema", () => {
    const testSchema = z.object({
      textField: z.string(),
      textFieldTwo: z.string(),
      booleanField: z.string(),
      t: z.string(),
      t2: z.string(),
      t3: z.string(),
      t4: z.string(),
      t5: z.string(),
    });

    render(
      <TestForm
        schema={testSchema}
        props={{
          textField: {
            testId: testIds.textField,
          },
          textFieldTwo: {
            testId: testIds.textFieldTwo,
          },
          booleanField: {
            testId: testIds.booleanField,
          },
        }}
      />
    );

    expect(screen.queryByTestId(testIds.textField)).toBeTruthy();
    expect(screen.queryByTestId(testIds.textFieldTwo)).toBeTruthy();
    expect(screen.queryByTestId(testIds.booleanField)).toBeTruthy();
  });
  it("should throw an error when no matching schema is found in mapping", () => {
    const Schema = z.object({
      enum: z.enum(["Yes"]),
    });

    expect(() =>
      render(
        <TestForm
          schema={Schema}
          props={{
            //@ts-ignore
            enum: {
              testId: "nope",
            },
          }}
        />
      )
    ).toThrowError(noMatchingSchemaErrorMessage("enum"));
  });
  it("should render the CustomTextField for the field with TestCustomFieldSchema, and also still render the regular TextField for a vanilla string", () => {
    const testSchema = z.object({
      textField: z.string(),
      textFieldCustom: TestCustomFieldSchema,
    });

    render(
      <TestForm
        schema={testSchema}
        props={{
          textField: {
            testId: "A Test ID",
          },
          textFieldCustom: {
            testId: "Yes",
            aCustomField: "Woohoo!!",
          },
        }}
      />
    );

    expect(screen.queryByTestId(customFieldTestId)).toBeTruthy();
    expect(screen.queryByTestId(textFieldTestId)).toBeTruthy();
  });
  it("should render the label and placeholder text for the text field if they're passed via description", () => {
    const label = "label";
    const placeholder = "placeholder";
    const Schema = z.object({
      id: z
        .string()
        .optional()
        .describe(`${label}${SPLIT_DESCRIPTION_SYMBOL}${placeholder}`),
    });
    render(
      <TestForm
        schema={Schema}
        props={{
          id: {},
        }}
      />
    );

    expect(screen.queryByPlaceholderText(placeholder)).toBeTruthy();
    expect(screen.queryByText(label)).toBeTruthy();
  });
  it("should prefer the prop label and placeholder over the ones passed via describe", () => {
    const labelDescribe = "labeld";
    const placeholderDescribe = "placeholderd";
    const labelProps = "labelp";
    const placeholderProp = "placeholderp";
    const Schema = z.object({
      id: z
        .string()
        .optional()
        .describe(
          `${labelDescribe}${SPLIT_DESCRIPTION_SYMBOL}${placeholderDescribe}`
        ),
    });

    render(
      <TestForm
        schema={Schema}
        props={{
          id: {
            label: labelProps,
            placeholder: placeholderProp,
          },
        }}
      />
    );

    expect(screen.queryByPlaceholderText(placeholderDescribe)).toBeNull();
    expect(screen.queryByPlaceholderText(placeholderProp)).toBeTruthy();
    expect(screen.queryByText(labelDescribe)).toBeNull();
    expect(screen.queryByText(labelProps)).toBeTruthy();
  });
});
