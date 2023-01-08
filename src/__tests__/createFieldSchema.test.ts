import { z } from "zod";
import {
  addHiddenProperties,
  createUniqueFieldSchema,
  duplicateIdErrorMessage,
  HIDDEN_ID_PROPERTY,
  isSchemaWithHiddenProperties,
} from "../createFieldSchema";
import { createTsForm } from "../createSchemaForm";
import { TextField } from "./utils/testForm";

describe("createFieldSchema", () => {
  it("should throw an error if an ID is used twice", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const mapping = [
      [createUniqueFieldSchema(z.string(), "id"), TextField],
      [createUniqueFieldSchema(z.string(), "id"), TextField],
    ] as const;

    expect(() => {
      createTsForm(mapping);
    }).toThrowError(duplicateIdErrorMessage("id"));
  });
  it("should not throw an error if two different ids are used", () => {
    const mapping = [
      [createUniqueFieldSchema(z.string(), "id"), TextField],
      [createUniqueFieldSchema(z.string(), "id2"), TextField],
    ] as const;
    expect(() => {
      createTsForm(mapping);
    }).not.toThrowError();
  });
});

describe("addHiddenProperties", () => {
  it("should add '_rtf_id' to the schema and should be typed as a schema with hidden properties", () => {
    const id = "a fake id";
    const schema = z.object({ id: z.string() });
    const withHiddenProperties = addHiddenProperties(schema, {
      [HIDDEN_ID_PROPERTY]: id,
    });
    expect(
      isSchemaWithHiddenProperties(withHiddenProperties) &&
        withHiddenProperties[HIDDEN_ID_PROPERTY] === id
    ).toStrictEqual(true);
  });
});
