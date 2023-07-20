import React, { ReactNode, useEffect, useState } from "react";
import { z } from "zod";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  customFieldTestId,
  TestCustomFieldSchema,
  TestForm,
  TestFormWithSubmit,
  TextField,
  textFieldTestId,
} from "./utils/testForm";
import {
  createTsForm,
  noMatchingSchemaErrorMessage,
  useFormResultValueChangedErrorMesssage,
} from "../createSchemaForm";
import {
  SPLIT_DESCRIPTION_SYMBOL as DESCRIPTION_SEPARATOR_SYMBOL,
  SPLIT_DESCRIPTION_SYMBOL,
} from "../getMetaInformationForZodType";
import {
  Control,
  useController,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import userEvent from "@testing-library/user-event";
import {
  useDescription,
  useEnumValues,
  useReqDescription,
  useTsController,
  useStringFieldInfo,
  useFieldInfo,
  useDateFieldInfo,
} from "../FieldContext";
import { expectTypeOf } from "expect-type";
import { createUniqueFieldSchema } from "../createFieldSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const testIds = {
  textField: "_text-field",
  textFieldTwo: "_text-field-2",
  booleanField: "_boolean-field",
};

function assertNever(_thing: never) {}

describe("createSchemaForm", () => {
  it("should render a text field and a boolean field based on the mapping and schema", () => {
    const testSchema = z.object({
      textField: z.string(),
      textFieldTwo: z.string(),
      booleanField: z.boolean(),
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
  it("should allow union props in components", () => {
    const testSchema = z.object({
      textField: z.string(),
    });

    function TextField(props: { testText: string } | { testNumber: number }) {
      return (
        <div>{"testText" in props ? props.testText : props.testNumber}</div>
      );
    }

    const mapping = [[z.string(), TextField] as const] as const;
    const TSForm = createTsForm(mapping);

    render(
      <TSForm
        onSubmit={() => {}}
        schema={testSchema}
        props={{
          textField: {
            testText: "text",
          },
        }}
      />
    );

    expect(screen.queryByText("text")).toBeTruthy();
    render(
      <TSForm
        onSubmit={() => {}}
        schema={testSchema}
        props={{
          textField: {
            testNumber: 101,
          },
        }}
      />
    );

    expect(screen.queryByText("101")).toBeTruthy();
  });
  it("should type the onSubmit properly", () => {
    const testSchema = z.object({
      textField: z.string(),
      numberField: z.number(),
      booleanField: z.boolean(),
    });

    render(
      <TestForm
        onSubmit={(v) => {
          if (typeof v.textField !== "string") {
            assertNever(v.textField);
          }
          if (typeof v.numberField !== "number") {
            assertNever(v.numberField);
          }
          if (typeof v.booleanField !== "boolean") {
            assertNever(v.booleanField);
          }
        }}
        schema={testSchema}
        props={{
          textField: {
            testId: testIds.textField,
          },
          numberField: {
            testId: "number-field",
          },
          booleanField: {
            testId: testIds.booleanField,
          },
        }}
      />
    );

    // this test is just about types
    expect(true).toBe(true);
  });
  it("should render a text field and a boolean field based on the mapping and schema into slots in a custom form", () => {
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

    const extraTestIds = {
      extra1: "extra-form-fun",
      extra2: "extra-form-fun2",
    };
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
      >
        {({ textField, booleanField, ...restFields }) => {
          return (
            <>
              <div data-testid={extraTestIds.extra1}>{textField}</div>
              <div data-testid={extraTestIds.extra2}>{booleanField}</div>
              {Object.values(restFields)}
            </>
          );
        }}
      </TestForm>
    );

    expect(screen.queryByTestId(testIds.textField)).toBeTruthy();
    expect(screen.queryByTestId(testIds.textFieldTwo)).toBeTruthy();
    expect(screen.queryByTestId(testIds.booleanField)).toBeTruthy();
    expect(screen.queryByTestId(extraTestIds.extra1)).toBeTruthy();
    expect(screen.queryByTestId(extraTestIds.extra2)).toBeTruthy();
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
          onSubmit={() => {}}
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
  it("should track submitting properly", async () => {
    const testId = "id";
    const val = "true";
    let submitPromiseResolve: () => void = () => {};
    const submitPromise = new Promise<void>((resolve) => {
      submitPromiseResolve = resolve;
    });
    let submitting = false;
    function Component() {
      const form = useForm({
        defaultValues: {
          v: val,
        },
      });
      submitting = form.formState.isSubmitting;
      return (
        <TestFormWithSubmit
          form={form}
          schema={z.object({
            v: z.string(),
          })}
          onSubmit={() => {
            return submitPromise;
          }}
          props={{
            v: {
              testId: testId,
            },
          }}
        />
      );
    }

    render(<Component />);
    const button = screen.getByText("submit");
    await userEvent.click(button);
    expect(submitting).toBe(true);
    submitPromiseResolve();
    waitFor(() => expect(submitting).toBe(false));
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
      n: z.enum(["e"]).describe(`l${SPLIT_DESCRIPTION_SYMBOL}p`),
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
      [z.string().describe(`a ${SPLIT_DESCRIPTION_SYMBOL} b`), Comp] as const,
    ] as const;

    const Form = createTsForm(componentMap);

    const FormSchema = z.object({
      field: z.string().describe(`a ${SPLIT_DESCRIPTION_SYMBOL} b`),
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
        expectTypeOf(data).toBeString();
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
  it("should show a required error and not submit after deleting a default value and submitting", async () => {
    const mockOnSubmit = jest.fn();
    function Input() {
      const {
        field: { onChange, value },
        error,
      } = useTsController<number>();
      const [_, setRerender] = useState(0);
      return (
        <>
          <input
            value={value !== undefined ? value + "" : ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value)) onChange(undefined);
              else onChange(value);
            }}
            placeholder={"input"}
          />
          <button type={"button"} onClick={() => setRerender((old) => old + 1)}>
            rerender button
          </button>
          {error?.errorMessage && <span>{error.errorMessage}</span>}
        </>
      );
    }
    const mapping = [[z.number(), Input]] as const;
    const Form = createTsForm(mapping);
    const defaultValues = {
      number: 5,
    };

    render(
      <Form
        onSubmit={mockOnSubmit}
        schema={z.object({
          number: z.number({ required_error: "req" }),
        })}
        defaultValues={defaultValues}
        renderAfter={() => <button>submit</button>}
      />
    );

    const button = screen.getByText("submit");
    const input = screen.getByPlaceholderText("input");
    const rerenderButton = screen.getByText("rerender button");

    await userEvent.clear(input);
    await userEvent.click(button);
    await userEvent.click(rerenderButton);

    expect(screen.getByText("req")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  it("should be to clear an input, type into the input, and then submit.", async () => {
    const mockOnSubmit = jest.fn();
    function Input() {
      const {
        field: { onChange, value },
        error,
      } = useTsController<number>();
      const [_, setRerender] = useState(0);
      return (
        <>
          <input
            value={value !== undefined ? value + "" : ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value)) onChange(undefined);
              else onChange(value);
            }}
            placeholder={"input"}
          />
          <button type={"button"} onClick={() => setRerender((old) => old + 1)}>
            rerender button
          </button>
          {error?.errorMessage && <span>{error.errorMessage}</span>}
        </>
      );
    }
    const mapping = [[z.number(), Input]] as const;
    const Form = createTsForm(mapping);
    const defaultValues = {
      number: 5,
    };

    render(
      <Form
        onSubmit={mockOnSubmit}
        schema={z.object({
          number: z.number({ required_error: "req" }),
        })}
        defaultValues={defaultValues}
        renderAfter={() => <button>submit</button>}
      />
    );

    const button = screen.getByText("submit");
    const input = screen.getByPlaceholderText("input");
    const rerenderButton = screen.getByText("rerender button");

    await userEvent.clear(input);
    await userEvent.type(input, "5");
    await userEvent.click(button);
    await userEvent.click(rerenderButton);

    expect(screen.queryByText("req")).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith({ number: 5 });
  });
  it("should be possible to submit with default values with no edits.", async () => {
    const mockOnSubmit = jest.fn();
    function Input() {
      const {
        field: { onChange, value },
        error,
      } = useTsController<number>();
      const [_, setRerender] = useState(0);
      return (
        <>
          <input
            value={value !== undefined ? value + "" : ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value)) onChange(undefined);
              else onChange(value);
            }}
            placeholder={"input"}
          />
          <button type={"button"} onClick={() => setRerender((old) => old + 1)}>
            rerender button
          </button>
          {error?.errorMessage && <span>{error.errorMessage}</span>}
        </>
      );
    }
    const mapping = [[z.number(), Input]] as const;
    const Form = createTsForm(mapping);
    const defaultValues = {
      number: 5,
    };

    render(
      <Form
        onSubmit={mockOnSubmit}
        schema={z.object({
          number: z.number({ required_error: "req" }),
        })}
        defaultValues={defaultValues}
        renderAfter={() => <button>submit</button>}
      />
    );

    const button = screen.getByText("submit");
    await userEvent.click(button);

    expect(screen.queryByText("req")).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith({ number: 5 });
  });
  it("should be possible to pass 'defaultValues' prop and 'form' prop and apply the default values.", async () => {
    const mockOnSubmit = jest.fn();
    function Input() {
      const {
        field: { onChange, value },
        error,
      } = useTsController<number>();
      const [_, setRerender] = useState(0);
      return (
        <>
          <input
            value={value !== undefined ? value + "" : ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value)) onChange(undefined);
              else onChange(value);
            }}
            placeholder={"input"}
          />
          <button type={"button"} onClick={() => setRerender((old) => old + 1)}>
            rerender button
          </button>
          {error?.errorMessage && <span>{error.errorMessage}</span>}
        </>
      );
    }

    function Outer() {
      const form = useForm<any>();

      return (
        <Form
          onSubmit={mockOnSubmit}
          schema={z.object({
            number: z.number({ required_error: "req" }),
          })}
          form={form}
          defaultValues={defaultValues}
          renderAfter={() => <button>submit</button>}
        />
      );
    }

    const mapping = [[z.number(), Input]] as const;
    const Form = createTsForm(mapping);
    const defaultValues = {
      number: 5,
    };

    render(<Outer />);

    const button = screen.getByText("submit");
    await userEvent.click(button);

    expect(screen.queryByText("req")).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith({ number: 5 });
  });
  it("should render the correct component when a schema created with createSchemaForm is optional", () => {
    const StringSchema = createUniqueFieldSchema(z.string(), "string");
    const NumberSchema = createUniqueFieldSchema(z.number(), "number");

    function TextField() {
      return <div>text</div>;
    }

    function NumberField() {
      return <div>number</div>;
    }

    const mapping = [
      [StringSchema, TextField],
      [z.string(), TextField],
      [NumberSchema, NumberField],
    ] as const;

    const Form = createTsForm(mapping);

    const schema = z.object({
      name: StringSchema.optional(), // if .optional is added to a schema it stops working
      age: NumberSchema,
    });
    render(<Form schema={schema} onSubmit={() => {}} />);

    expect(screen.queryByText("text")).toBeInTheDocument();
    expect(screen.queryByText("number")).toBeInTheDocument();
  });
  it("should render two different enum components when createUniqueFieldSchema is used", () => {
    function FieldOne() {
      return <div>one</div>;
    }

    function FieldTwo(_props: { prop: string }) {
      return <div>two</div>;
    }

    const uniqueField = createUniqueFieldSchema(
      z.enum(["three", "four"]),
      "id"
    );

    const mapping = [
      [z.enum(["one", "two"]), FieldOne],
      [uniqueField, FieldTwo],
    ] as const;

    const Form = createTsForm(mapping);
    const Schema = z.object({
      one: z.enum(["one", "two"]),
      two: uniqueField,
    });

    render(
      <Form
        schema={Schema}
        onSubmit={() => {}}
        props={{ two: { prop: "str" } }}
      />
    );

    expect(screen.queryByText("one")).toBeInTheDocument();
    expect(screen.queryByText("two")).toBeInTheDocument();
  });
  it("should be possible to get ZodAny information using `useFieldInfo`", () => {
    const testData = {
      requiredTextField: {
        label: "required-label",
        placeholder: "required-placeholder",
        uniqueId: "required-text-field",
      },
      optionalTextField: {
        label: "optional-label",
        placeholder: "optional-placeholder",
        uniqueId: "optional-text-field",
      },
    };

    const description = (k: keyof typeof testData) =>
      `${testData[k].label}${DESCRIPTION_SEPARATOR_SYMBOL}${testData[k].placeholder}`;

    const RequiredTextFieldSchema = createUniqueFieldSchema(
      z.string(),
      testData.requiredTextField.uniqueId
    );

    const OptionalTextFieldSchema = createUniqueFieldSchema(
      z.string().optional(),
      testData.optionalTextField.uniqueId
    );

    function RequiredTextField() {
      const fieldInfo = useFieldInfo();

      expect(fieldInfo.isOptional).toBeFalsy();
      expect(fieldInfo.label).toBe(testData.requiredTextField.label);
      expect(fieldInfo.placeholder).toBe(
        testData.requiredTextField.placeholder
      );
      expect(fieldInfo.uniqueId).toBe(testData.requiredTextField.uniqueId);

      return <input />;
    }

    function OptionalTextField() {
      const fieldInfo = useFieldInfo();

      expect(fieldInfo.isOptional).toBe(true);
      expect(fieldInfo.label).toBe(testData.optionalTextField.label);
      expect(fieldInfo.placeholder).toBe(
        testData.optionalTextField.placeholder
      );
      expect(fieldInfo.uniqueId).toBe(testData.optionalTextField.uniqueId);

      return <input />;
    }

    const defaultEmail = "john@example.com";

    const DefaultTextField = () => {
      // @ts-expect-error
      const { defaultValue, type, zodType } = useFieldInfo();

      expect(defaultValue).toBe(defaultEmail);

      return <input />;
    };

    const schema = z.object({
      email: z.string().default(defaultEmail),
      name: RequiredTextFieldSchema.describe(description("requiredTextField")),
      nickName: OptionalTextFieldSchema.describe(
        description("optionalTextField")
      ),
    });

    const mapping = [
      [z.string(), DefaultTextField],
      [RequiredTextFieldSchema, RequiredTextField],
      [OptionalTextFieldSchema, OptionalTextField],
    ] as const;

    const Form = createTsForm(mapping);

    render(<Form schema={schema} onSubmit={() => {}} />);
  });
  it("should be possible to get ZodString information using `useStringFieldInfo`", () => {
    const testData = {
      textField: {
        uniqueId: "text-field-id",
        label: "text-field-label",
        placeholder: "text-field-placeholder",
        min: 5,
        max: 16,
        get schema() {
          const { min, max, uniqueId } = this;
          return createUniqueFieldSchema(
            z.string().min(min).max(max),
            uniqueId
          );
        },

        get component() {
          const { min, max, label, uniqueId } = this;

          const TextFieldComponent = () => {
            const fieldInfo = useStringFieldInfo();

            expect(fieldInfo.minLength).toBe(min);
            expect(fieldInfo.maxLength).toBe(max);
            expect(fieldInfo.label).toBe(label);
            expect(fieldInfo.uniqueId).toBe(uniqueId);

            return <div>{fieldInfo.label}</div>;
          };

          return TextFieldComponent;
        },
      },
      arrayTextField: {
        uniqueId: "array-text-field-id",
        label: "array-text-field-label",
        placeholder: "array-text-field-placeholder",
        min: 5,
        max: 16,
        get schema() {
          const { min, max, uniqueId } = this;
          return createUniqueFieldSchema(
            z.string().min(min).max(max).array(),
            uniqueId
          );
        },
        get component() {
          const { min, max, label, uniqueId } = this;

          const ArrayTextFieldComponent = () => {
            const fieldInfo = useStringFieldInfo();

            expect(fieldInfo.minLength).toBe(min);
            expect(fieldInfo.maxLength).toBe(max);
            expect(fieldInfo.label).toBe(label);
            expect(fieldInfo.uniqueId).toBe(uniqueId);

            return <div>{fieldInfo.label}</div>;
          };

          return ArrayTextFieldComponent;
        },
      },
    };

    const description = (k: keyof typeof testData) =>
      `${testData[k].label}${DESCRIPTION_SEPARATOR_SYMBOL}${testData[k].placeholder}`;

    const { textField, arrayTextField } = testData;

    const schema = z.object({
      name: textField.schema.describe(description("textField")),
      users: arrayTextField.schema.describe(description("arrayTextField")),
    });

    const mapping = [
      [textField.schema, textField.component],
      [arrayTextField.schema, arrayTextField.component],
    ] as const;

    const Form = createTsForm(mapping);

    render(<Form schema={schema} onSubmit={() => {}} />);

    expect(screen.queryByText(testData.textField.label)).toBeInTheDocument();
    expect(
      screen.queryByText(testData.arrayTextField.label)
    ).toBeInTheDocument();
  });

  it("should be possible to get ZodDate information using `useDateFieldInfo`", () => {
    const testData = {
      dateField: {
        uniqueId: "date-field-id",
        label: "date-field-label",
        placeholder: "date-field-placeholder",
        min: new Date(2021, 1, 1),
        max: new Date(2020, 1, 1),
        get schema() {
          const { uniqueId, min, max } = this;
          return createUniqueFieldSchema(z.date().min(min).max(max), uniqueId);
        },

        get component() {
          const { min, max, label, uniqueId } = this;

          const DateFieldComponent = () => {
            const fieldInfo = useDateFieldInfo();

            expect(fieldInfo.minDate).toStrictEqual(min);
            expect(fieldInfo.maxDate).toStrictEqual(max);
            expect(fieldInfo.label).toBe(label);
            expect(fieldInfo.uniqueId).toBe(uniqueId);

            return <div>{fieldInfo.label}</div>;
          };

          return DateFieldComponent;
        },
      },
      arrayDateField: {
        uniqueId: "array-date-field-id",
        label: "array-date-field-label",
        placeholder: "array-date-field-placeholder",
        min: new Date(2021, 1, 1),
        max: new Date(2020, 1, 1),
        get schema() {
          const { uniqueId, min, max } = this;
          return createUniqueFieldSchema(z.date().min(min).max(max), uniqueId);
        },
        get component() {
          const { min, max, label, uniqueId } = this;

          const ArrayDateFieldComponent = () => {
            const fieldInfo = useDateFieldInfo();

            expect(fieldInfo.minDate).toStrictEqual(min);
            expect(fieldInfo.maxDate).toStrictEqual(max);
            expect(fieldInfo.label).toBe(label);
            expect(fieldInfo.uniqueId).toBe(uniqueId);

            return <div>{fieldInfo.label}</div>;
          };

          return ArrayDateFieldComponent;
        },
      },
    };

    const description = (k: keyof typeof testData) =>
      `${testData[k].label}${DESCRIPTION_SEPARATOR_SYMBOL}${testData[k].placeholder}`;

    const { dateField, arrayDateField } = testData;

    const schema = z.object({
      name: dateField.schema.describe(description("dateField")),
      users: arrayDateField.schema.describe(description("arrayDateField")),
    });

    const mapping = [
      [dateField.schema, dateField.component],
      [arrayDateField.schema, arrayDateField.component],
    ] as const;

    const Form = createTsForm(mapping);

    render(<Form schema={schema} onSubmit={() => {}} />);

    expect(screen.queryByText(testData.dateField.label)).toBeInTheDocument();
    expect(
      screen.queryByText(testData.arrayDateField.label)
    ).toBeInTheDocument();
  });

  it("should render the correct components for a nested object schema if unmaped", async () => {
    const NumberSchema = createUniqueFieldSchema(z.number(), "number");
    const mockOnSubmit = jest.fn();

    function TextField({}: { b: "1" }) {
      const { error } = useTsController<string>();
      return (
        <>
          <div>text</div>
          <div data-testid="error">{error?.errorMessage}</div>
        </>
      );
    }

    function NumberField({}: { a: 1 }) {
      return <div>number</div>;
    }

    function BooleanField({}: { c: boolean }) {
      return <div>boolean</div>;
    }

    const objectSchema = z.object({
      text: z.string(),
      age: NumberSchema,
    });
    const objectSchema2 = z.object({
      bool: z.boolean(),
    });

    const mapping = [
      [z.string(), TextField],
      [NumberSchema, NumberField],
      [z.boolean(), BooleanField],
      [objectSchema2, BooleanField],
    ] as const;

    const Form = createTsForm(mapping);

    const schema = z.object({
      nestedField: objectSchema,
      nestedField2: objectSchema2,
    });
    const defaultValues = {
      nestedField: { text: "name", age: 9 },
      nestedField2: { bool: true },
    };
    // TODO: test validation
    render(
      <Form
        schema={schema}
        onSubmit={mockOnSubmit}
        defaultValues={defaultValues}
        props={{
          nestedField2: { c: true },
          nestedField: { text: { b: "1" }, age: { a: 1 } },
        }}
        renderAfter={() => <button type="submit">submit</button>}
      />
    );
    const button = screen.getByText("submit");
    await userEvent.click(button);

    const textNodes = screen.queryByText("text");
    expect(textNodes).toBeInTheDocument();
    const numberNodes = screen.queryByText("number");
    expect(numberNodes).toBeInTheDocument();
    expect(screen.queryByTestId("error")).toHaveTextContent("");
    expect(mockOnSubmit).toHaveBeenCalledWith(defaultValues);
  });
  it("should render two copies of an object schema if in an unmapped array schema", async () => {
    const NumberSchema = createUniqueFieldSchema(z.number(), "number");
    const mockOnSubmit = jest.fn();

    function TextField({}: { a?: 1 }) {
      return <div>text</div>;
    }

    function NumberField() {
      return <div>number</div>;
    }

    function ObjectField({ objProp }: { objProp: 2 }) {
      return <div>{objProp}</div>;
    }

    const otherObjSchema = z.object({
      text: z.string().optional(),
    });
    const mapping = [
      [z.string(), TextField],
      [NumberSchema, NumberField],
      [otherObjSchema, ObjectField],
    ] as const;

    const Form = createTsForm(mapping);

    const schema = z.object({
      arrayField: z
        .object({
          text: z.string(),
          age: NumberSchema,
          otherObj: otherObjSchema.optional(),
        })
        .array(),
    });
    const defaultValues = {
      arrayField: [
        { text: "name", age: 9 },
        { text: "name2", age: 10 },
      ],
    };
    render(
      <Form
        schema={schema}
        onSubmit={mockOnSubmit}
        defaultValues={defaultValues}
        // otherObj tests that nonrecursive mapping still works at the last level of the recursion depth
        props={{ arrayField: { text: { a: 1 }, otherObj: { objProp: 2 } } }}
        renderAfter={() => {
          return <button type="submit">submit</button>;
        }}
      >
        {(renderedFields) => {
          return (
            <>
              {renderedFields.arrayField.map(
                ({ text, age }: any, i: number) => (
                  <React.Fragment key={i}>
                    {text}
                    {age}
                  </React.Fragment>
                )
              )}
            </>
          );
        }}
      </Form>
    );

    const textNodes = screen.queryAllByText("text");
    textNodes.forEach((node) => expect(node).toBeInTheDocument());
    expect(textNodes).toHaveLength(2);

    const numberNodes = screen.queryAllByText("number");
    numberNodes.forEach((node) => expect(node).toBeInTheDocument());
    expect(numberNodes).toHaveLength(2);

    const button = screen.getByText("submit");
    await userEvent.click(button);
    expect(mockOnSubmit).toHaveBeenCalledWith(defaultValues);
  });

  it("should render an array component despite recusions", async () => {
    const mockOnSubmit = jest.fn(() => {});
    function DynamicArray() {
      const {
        field: { value, onChange },
      } = useTsController<string[]>();

      return (
        <div data-testid="dynamic-array">
          <button
            type="button"
            data-testid="add-element"
            onClick={() => {
              onChange(value?.concat([""]));
            }}
          >
            Add one element to array
          </button>
          {value?.map((val, i) => {
            return (
              <input
                key={i}
                data-testid={`dynamic-array-input${i}`}
                value={val}
                onChange={(e) =>
                  onChange(value?.map((v, j) => (i === j ? e.target.value : v)))
                }
              />
            );
          })}
        </div>
      );
    }

    function NumberField() {
      return <div>number</div>;
    }

    const mapping = [
      [z.string().array(), DynamicArray],
      [z.number(), NumberField],
    ] as const;

    const Form = createTsForm(mapping);

    const schema = z.object({
      arrayField: z.string().array(),
      numberArray: z.number().array(),
    });
    const defaultValues = {
      arrayField: ["name", "name2"],
      numberArray: [1, 2, 3],
    };
    render(
      <Form
        onSubmit={mockOnSubmit}
        schema={schema}
        defaultValues={defaultValues}
        props={{}}
        renderAfter={() => {
          return <button type="submit">submit</button>;
        }}
      ></Form>
    );

    const numberNodes = screen.queryAllByText("number");
    numberNodes.forEach((node) => expect(node).toBeInTheDocument());
    expect(numberNodes).toHaveLength(3);

    expect(screen.getByTestId("dynamic-array")).toBeInTheDocument();
    const addElementButton = screen.getByTestId("add-element");
    await userEvent.click(addElementButton);

    const inputs = screen.getAllByTestId(/dynamic-array-input/);
    expect(inputs.length).toBe(3);

    const input3 = screen.getByTestId("dynamic-array-input2");
    await userEvent.type(input3, "name3");
    const button = screen.getByText("submit");
    await userEvent.click(button);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      arrayField: ["name", "name2", "name3"],
      numberArray: [1, 2, 3],
    });
  });
  it("should render an array component with objects, and should map nonempty()", async () => {
    const mockOnSubmit = jest.fn(() => {});
    const objectSchema = z.object({
      text: z.string(),
      numberField: z.number(),
    });
    function DynamicArray(_props: { something?: boolean }) {
      const {
        field: { value, onChange },
      } = useTsController<z.infer<typeof objectSchema>[]>();

      return (
        <div data-testid="dynamic-array">
          <button
            type="button"
            data-testid="add-element"
            onClick={() => {
              onChange(value?.concat([{ text: "", numberField: 2 }]));
            }}
          >
            Add one element to array
          </button>
          {value?.map((val, i) => {
            return (
              <input
                key={i}
                data-testid={`dynamic-array-input${i}`}
                value={val.text}
                onChange={(e) =>
                  onChange(
                    value?.map((v, j) =>
                      i === j ? { ...v, text: e.target.value } : v
                    )
                  )
                }
              />
            );
          })}
        </div>
      );
    }

    function NumberField() {
      return <div>number</div>;
    }

    const mapping = [
      [objectSchema.array(), DynamicArray],
      [z.number(), NumberField],
    ] as const;

    const Form = createTsForm(mapping);

    const schema = z.object({
      arrayField: objectSchema.array().nonempty(),
      numberArray: z.number().array(),
    });
    const defaultValues = {
      arrayField: [
        { text: "name", numberField: 2 },
        { text: "name2", numberField: 2 },
      ],
      numberArray: [1, 2, 3],
    };
    render(
      <Form
        onSubmit={mockOnSubmit}
        schema={schema}
        defaultValues={defaultValues}
        props={{ arrayField: { something: true } }}
        renderAfter={() => {
          return <button type="submit">submit</button>;
        }}
      ></Form>
    );

    const numberNodes = screen.queryAllByText("number");
    numberNodes.forEach((node) => expect(node).toBeInTheDocument());
    expect(numberNodes).toHaveLength(3);

    expect(screen.getByTestId("dynamic-array")).toBeInTheDocument();
    const addElementButton = screen.getByTestId("add-element");
    await userEvent.click(addElementButton);

    const inputs = screen.getAllByTestId(/dynamic-array-input/);
    expect(inputs.length).toBe(3);
  });
  describe("CustomChildComponent", () => {
    it("should not drop focus on rerender", async () => {
      const schema = z.object({
        fieldOne: z.string().regex(/moo/),
        fieldTwo: z.string(),
      });

      const Form = createTsForm([[z.string(), TextField]] as const, {
        FormComponent: ({
          children,
        }: {
          onSubmit: () => void;
          children: ReactNode;
        }) => {
          const { isSubmitting } = useFormState();
          return (
            <form>
              {children}
              {isSubmitting}
            </form>
          );
        },
      });

      const TestComponent = () => {
        const form = useForm<z.infer<typeof schema>>({
          mode: "onChange",
          resolver: zodResolver(schema),
        });
        const values = {
          ...form.getValues(),
          ...useWatch({ control: form.control }),
        };

        return (
          <Form
            form={form}
            schema={schema}
            defaultValues={{}}
            props={{
              fieldOne: {
                testId: "fieldOne",
                beforeElement: <>Moo{JSON.stringify(values)}</>,
              },
              fieldTwo: { testId: "fieldTwo" },
            }}
            onSubmit={() => {}}
          >
            {(fields) => {
              const { isDirty } = useFormState();
              const [state, setState] = useState(0);
              useEffect(() => {
                setState(1);
              }, []);
              return (
                <>
                  {Object.values(fields)}
                  <div data-testid="dirty">{JSON.stringify(isDirty)}</div>
                  <div data-testid="state">{state}</div>
                </>
              );
            }}
          </Form>
        );
      };
      render(<TestComponent />);
      const fieldOne = screen.queryByTestId("fieldOne");
      if (!fieldOne) throw new Error("fieldOne not found");
      fieldOne.focus();
      expect(fieldOne).toHaveFocus();
      await userEvent.type(fieldOne, "t");
      expect(fieldOne).toHaveFocus();
      await userEvent.type(fieldOne, "2");
      expect(fieldOne).toHaveFocus();
      // verify that context and stateful hooks still work
      expect(screen.queryByTestId("dirty")).toHaveTextContent("true");
      expect(screen.queryByTestId("state")).toHaveTextContent("1");
      screen.debug();
    });
  });
});
