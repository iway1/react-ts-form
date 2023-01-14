import React, { ReactNode, useState } from "react";
import { z } from "zod";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  customFieldTestId,
  TestCustomFieldSchema,
  TestForm,
  textFieldTestId,
} from "./utils/testForm";
import {
  createTsForm,
  noMatchingSchemaErrorMessage,
  useFormResultValueChangedErrorMesssage,
} from "../createSchemaForm";
import { SPLIT_DESCRIPTION_SYMBOL as DESCRIPTION_SEPARATOR_SYMBOL } from "../getMetaInformationForZodType";
import { Control, useController, useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import {
  useDescription,
  useEnumValues,
  useReqDescription,
  useTsController,
} from "../FieldContext";
import { createUniqueFieldSchema } from "../createFieldSchema";

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
        onSubmit={() => {}}
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
  it("should render a text field and a boolean field based on the mapping and schema, unwrapping refine calls", () => {
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
        onSubmit={() => {}}
        schema={testSchema.refine((_) => true, {
          message: "cool",
        })}
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
    const mapping = [[z.string(), () => <input />] as const] as const;

    const enumSchema = z.enum(["Yes"]);

    const Schema = z.object({
      enum: enumSchema,
    });
    const Form = createTsForm(mapping);

    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Form
          schema={Schema}
          props={{
            //@ts-ignore
            enum: {
              //@ts-ignore
              testId: "nope",
            },
          }}
        />
      )
    ).toThrowError(
      noMatchingSchemaErrorMessage("enum", enumSchema._def.typeName)
    );
  });
  it("should render the CustomTextField for the field with TestCustomFieldSchema, and also still render the regular TextField for a vanilla string", () => {
    const testSchema = z.object({
      textField: z.string(),
      textFieldCustom: TestCustomFieldSchema,
    });

    render(
      <TestForm
        onSubmit={() => {}}
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
        .describe(`${label}${DESCRIPTION_SEPARATOR_SYMBOL}${placeholder}`),
    });
    render(<TestForm onSubmit={() => {}} schema={Schema} />);

    expect(screen.queryByPlaceholderText(placeholder)).toBeTruthy();
    expect(screen.queryByText(label)).toBeTruthy();
  });
  it("should pass enum values to the enum field", () => {
    const enumValues = ["a", "b", "c3p0"] as const;
    const Schema = z.object({
      enum: z.enum(enumValues),
    });

    render(<TestForm onSubmit={() => {}} schema={Schema} />);

    for (const value of enumValues) {
      expect(screen.queryByText(value)).toBeTruthy();
    }
  });
  it("should pass a label, placeholder and enum values to a optional enum field with description", () => {
    const enumValues = ["a", "b", "c3p0"] as const;
    const label = "label";
    const placeholder = "placeholder";
    const Schema = z.object({
      enum: z
        .enum(enumValues)
        .optional()
        .describe(`${label}${DESCRIPTION_SEPARATOR_SYMBOL}${placeholder}`),
    });

    render(<TestForm schema={Schema} onSubmit={() => {}} />);

    for (const value of enumValues) {
      expect(screen.queryByText(value)).toBeTruthy();
    }

    expect(screen.queryByText(label)).toBeInTheDocument();
    expect(screen.queryByText(placeholder)).toBeInTheDocument();
  });
  it("should render with default values if they're passed", () => {
    const defaultValue = "default";
    const Schema = z.object({
      textField: z.string(),
    });

    render(
      <TestForm
        schema={Schema}
        defaultValues={{ textField: defaultValue }}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
  });

  it("should render a custom form component that should call on submit", async () => {
    const onSubmitMock = jest.fn();
    const Schema = z.object({
      fieldOne: z.string(),
      fieldTwo: z.boolean(),
    });
    const buttonText = "press";
    const textFieldTestId = "text";

    const booleanFieldTestId = "bool";

    const expectedValues: z.infer<typeof Schema> = {
      fieldOne: "A user typed this",
      fieldTwo: true,
    };

    const FormComponent = ({
      onSubmit,
      children,
    }: {
      onSubmit: () => void;
      children: ReactNode;
    }) => {
      return (
        <form>
          {children}
          <button onClick={onSubmit}>{buttonText}</button>
        </form>
      );
    };
    function TextField({
      name,
      control,
    }: {
      name: string;
      control: Control<any>;
    }) {
      const { field } = useController({ control, name });
      return (
        <input
          value={field.value ? field.value : ""}
          onChange={(e) => field.onChange(e.target.value)}
          data-testid={textFieldTestId}
        />
      );
    }
    function BooleanField({
      name,
      control,
    }: {
      name: string;
      control: Control<any>;
    }) {
      const { field } = useController({ control, name });
      return (
        <input
          type="checkbox"
          data-testid={booleanFieldTestId}
          checked={field.value ? field.value : false}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      );
    }
    const mapping = [
      [z.string(), TextField] as const,
      [z.boolean(), BooleanField] as const,
    ] as const;
    const TSForm = createTsForm(mapping, { FormComponent });

    render(
      <TSForm
        props={{ fieldOne: {} }}
        onSubmit={onSubmitMock}
        schema={Schema}
      />
    );

    const stringInput = screen.getByTestId(textFieldTestId);
    const booleanInput = screen.getByTestId(booleanFieldTestId);
    const button = screen.getByText(buttonText);
    stringInput.focus();
    await userEvent.click(stringInput);
    await userEvent.type(stringInput, expectedValues.fieldOne);
    await userEvent.click(booleanInput);
    await userEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(onSubmitMock).toHaveBeenCalledWith(expectedValues);
  });
  it("should render the 'beforeElement' and 'afterElement' props if they're passed.", () => {
    const Schema = z.object({ id: z.string() });
    const beforeText = `b4`;
    const afterText = `aff-ter`;

    render(
      <TestForm
        schema={Schema}
        onSubmit={() => {}}
        props={{
          id: {
            beforeElement: <div>{beforeText}</div>,
            afterElement: <div>{afterText}</div>,
          },
        }}
      />
    );

    expect(screen.queryByText(beforeText)).toBeInTheDocument();
    expect(screen.queryByText(afterText)).toBeInTheDocument();
  });
  it("should allow creating a submit button with the 'renderAfter' prop.", async () => {
    const onSubmitMock = jest.fn();
    const Schema = z.object({
      id: z.string(),
    });
    const textFieldId = "a";
    const buttonTestId = "button";
    const expectedOutput = {
      id: "string",
    };

    render(
      <TestForm
        schema={Schema}
        props={{
          id: {
            testId: textFieldId,
          },
        }}
        onSubmit={onSubmitMock}
        renderAfter={({ submit }) => (
          <button
            type="button"
            data-testid={buttonTestId}
            onClick={() => submit()}
          ></button>
        )}
      />
    );
    const textInput = screen.getByTestId(textFieldId);
    const submitButton = screen.getByTestId(buttonTestId);

    await userEvent.type(textInput, expectedOutput.id);
    await userEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith(expectedOutput);
  });
  it("should allow creating a submit button with the 'renderBefore' prop.", async () => {
    const onSubmitMock = jest.fn();
    const Schema = z.object({
      id: z.string(),
    });
    const textFieldId = "a";
    const buttonTestId = "button";
    const expectedOutput = {
      id: "string",
    };

    render(
      <TestForm
        schema={Schema}
        props={{
          id: {
            testId: textFieldId,
          },
        }}
        onSubmit={onSubmitMock}
        renderBefore={({ submit }) => (
          <button
            type="button"
            data-testid={buttonTestId}
            onClick={() => submit()}
          ></button>
        )}
      />
    );
    const textInput = screen.getByTestId(textFieldId);
    const submitButton = screen.getByTestId(buttonTestId);

    await userEvent.type(textInput, expectedOutput.id);
    await userEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith(expectedOutput);
  });
  it("should throw an error if the value of 'useFormResult' goes from undefined to defined", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const buttonId = "button";
    function TestComponent() {
      const uf = useForm<{ id: string }>();
      const [buttonPressed, setButtonPressed] = useState(false);
      return (
        <div>
          <TestForm
            form={buttonPressed ? uf : undefined}
            schema={z.object({
              id: z.string(),
            })}
            onSubmit={() => {}}
          />
          <button
            data-testid={buttonId}
            onClick={() => {
              setButtonPressed(true);
            }}
          >
            press
          </button>
        </div>
      );
    }

    render(<TestComponent />);
    const button = screen.getByTestId(buttonId);

    await expect(userEvent.click(button)).rejects.toThrowError(
      useFormResultValueChangedErrorMesssage()
    );
  });
  it("should be possible to set and read form state with useTsController", async () => {
    const errorMessage = "bad";
    const buttonTestId = "test";
    const inputTestId = "input";
    const testInput = "yo";
    const errorMessageId = "error";
    const renderButtonId = "render";
    const FormSchema = z.object({
      field: z.string().min(2, errorMessage),
    });
    function Component() {
      const {
        field,
        fieldState: { error },
      } = useTsController<string>();
      const [_, setState] = useState(0);
      return (
        <>
          <input
            value={field.value ? field.value : ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            data-testid={inputTestId}
          />
          {error && <span data-testid={errorMessageId}>{error.message}</span>}
          <button
            type="button"
            data-testid={renderButtonId}
            onClick={() => setState((v) => v + 1)}
          />
        </>
      );
    }
    const mapping = [[z.string(), Component] as const] as const;
    const Form = createTsForm(mapping);
    const submitMock = jest.fn();
    const expectedOutput: z.infer<typeof FormSchema> = {
      field: testInput,
    };

    render(
      <Form
        schema={FormSchema}
        onSubmit={submitMock}
        renderAfter={({ submit }) => (
          <button onClick={submit} data-testid={buttonTestId}>
            submit
          </button>
        )}
      />
    );

    const button = screen.getByTestId(buttonTestId);
    const renderButton = screen.getByTestId(renderButtonId);
    const textInput = screen.getByTestId(inputTestId);

    // Test error message
    await userEvent.click(button);
    await userEvent.type(textInput, testInput[0]!); // idk why but is necessary for rerender?
    await userEvent.click(renderButton);
    const errorMessageSpan = screen.getByTestId(errorMessageId);
    expect(errorMessageSpan).toBeInTheDocument();

    await userEvent.click(textInput);
    await userEvent.type(textInput, testInput.slice(1));
    await userEvent.click(button);

    expect(submitMock).toHaveBeenCalledTimes(1);
    expect(submitMock).toHaveBeenCalledWith(expectedOutput);
  });
  it("should render the default values passed in via the useFormResult prop", () => {
    const testId = "id";
    const val = "true";
    function Component() {
      const form = useForm({
        defaultValues: {
          v: val,
        },
      });
      return (
        <TestForm
          form={form}
          schema={z.object({
            v: z.string(),
          })}
          onSubmit={() => {}}
          props={{
            v: {
              testId: testId,
            },
          }}
        />
      );
    }

    render(<Component />);

    expect(screen.getByDisplayValue(val)).toBeInTheDocument();
  });
  it("should throw an error if useTsController is called outside of a @ts-react/form rendered component", () => {
    // hello 100% test coverage =D
    jest.spyOn(console, "error").mockImplementation(() => {});
    function C() {
      useTsController();
      return <div />;
    }
    expect(() => render(<C />)).toThrow();
  });
  it("should be possible to forward props to custom prop names via the props map", () => {
    const propsMapping = [
      ["control", "c"] as const,
      ["name", "n"] as const,
      ["enumValues", "e"] as const,
      ["descriptionLabel", "l"] as const,
      ["descriptionPlaceholder", "p"] as const,
    ] as const;
    function Component({
      c,
      n,
      l,
      p,
      e,
    }: {
      c: Control<any>;
      n: string;
      e: string[];
      l: string;
      p: string;
    }) {
      return (
        <>
          <div>{c ? "*" : ""}</div>
          <div>{n}</div>
          <div>{l}</div>
          <div>{p}</div>
          <div>{e[0]}</div>
        </>
      );
    }
    const mapping = [[z.enum([""]), Component] as const] as const;
    const Form = createTsForm(mapping, {
      propsMap: propsMapping,
    });
    const MySchema = z.object({
      n: z.enum(["e"]).describe("l//p"),
    });
    render(<Form schema={MySchema} onSubmit={(_) => {}} />);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("n")).toBeInTheDocument();
    expect(screen.getByText("e")).toBeInTheDocument();
    expect(screen.getByText("l")).toBeInTheDocument();
    expect(screen.getByText("p")).toBeInTheDocument();
  });
  it("should allow using the useDescription() hook to show descriptions", () => {
    const label = "label";
    const placeholder = "placeholder";
    function Component() {
      const { label, placeholder } = useDescription();
      return (
        <div>
          <div>{label}</div>
          <div>{placeholder}</div>
        </div>
      );
    }
    const mapping = [[z.string(), Component] as const] as const;
    const Form = createTsForm(mapping);

    render(
      <Form
        schema={z.object({
          field: z
            .string()
            .describe(`${label}${DESCRIPTION_SEPARATOR_SYMBOL}${placeholder}`),
        })}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });
  it("should be able to show description and label from required description / label", () => {
    const label = "label";
    const placeholder = "placeholder";
    function Component() {
      const { label, placeholder } = useReqDescription();
      return (
        <div>
          <div>{label}</div>
          <div>{placeholder}</div>
        </div>
      );
    }
    const mapping = [[z.string(), Component] as const] as const;
    const Form = createTsForm(mapping);

    render(
      <Form
        schema={z.object({
          field: z
            .string()
            .describe(`${label}${DESCRIPTION_SEPARATOR_SYMBOL}${placeholder}`),
        })}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });
  it("should throw an error when there is no placeholder passed via .describe() and useReqDesription is called", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const label = "label";
    function Component() {
      const { label, placeholder } = useReqDescription();
      return (
        <div>
          <div>{label}</div>
          <div>{placeholder}</div>
        </div>
      );
    }
    const mapping = [[z.string(), Component] as const] as const;
    const Form = createTsForm(mapping);

    expect(() =>
      render(
        <Form
          schema={z.object({
            field: z.string().describe(`${label}}`),
          })}
          onSubmit={() => {}}
        />
      )
    ).toThrow();
  });
  it("should throw an error when there is nothing passed via .describe() and useReqDesription is called", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    function Component() {
      const { label, placeholder } = useReqDescription();
      return (
        <div>
          <div>{label}</div>
          <div>{placeholder}</div>
        </div>
      );
    }
    const mapping = [[z.string(), Component] as const] as const;
    const Form = createTsForm(mapping);

    expect(() =>
      render(
        <Form
          schema={z.object({
            field: z.string(),
          })}
          onSubmit={() => {}}
        />
      )
    ).toThrow();
  });
  it("should pass a description and label via useReqDescription without propforwarding enabled", () => {
    function Comp() {
      const { label, placeholder } = useReqDescription();
      return (
        <>
          <div>{label}</div>
          <div>{placeholder}</div>
        </>
      );
    }
    const componentMap = [
      [z.string().describe("a//b"), Comp] as const,
    ] as const;

    const Form = createTsForm(componentMap);

    const FormSchema = z.object({
      field: z.string().describe("a//b"),
    });
    render(<Form schema={FormSchema} onSubmit={() => {}} />);

    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });
  it("should allow accessing enumValues via the `useEnumValues()` hook", () => {
    const Schema = z.object({
      enum: z.enum(["one", "two"]),
    });
    function Component({ req: _ }: { req: string }) {
      const enumValues = useEnumValues();
      return (
        <div>
          {enumValues.map((e) => (
            <span key={e}>{e}</span>
          ))}
        </div>
      );
    }
    const mapping = [[z.enum(["yep"]), Component] as const] as const;
    const Form = createTsForm(mapping);

    render(
      <Form
        schema={Schema}
        onSubmit={() => {}}
        props={{ enum: { req: "yes" } }}
      />
    );
  });
  it("should throw an error if useEnumValues() is called in a field not rendered by an enum schema", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const Schema = z.object({
      id: z.string(),
    });
    const mapping = [
      [
        z.string(),
        () => {
          useEnumValues();
          return <div></div>;
        },
      ] as const,
    ] as const;
    const Form = createTsForm(mapping);

    expect(() => {
      render(<Form schema={Schema} onSubmit={() => {}} />);
    }).toThrow();
  });

  it("should have correct typings with multiple unique field schemas when transform and refine are used.", () => {
    const A = createUniqueFieldSchema(z.string(), "one");
    const B = createUniqueFieldSchema(z.string(), "two");
    function In1(_: { req: string }) {
      return <div />;
    }
    function In2(_: { req2: string }) {
      return <div />;
    }
    const mapping = [
      [A, In1],
      [B, In2],
    ] as const;

    const Form = createTsForm(mapping);

    <Form
      schema={z
        .object({
          a: A,
          b: B,
        })
        .refine((_) => true)
        .transform((a) => a.a)}
      onSubmit={(data) => {
        data.startsWith("cool"); // just type checks as a string
      }}
      props={{
        a: {
          req: "One",
        },
        b: {
          req2: "Two",
        },
      }}
    />;
  });
});
