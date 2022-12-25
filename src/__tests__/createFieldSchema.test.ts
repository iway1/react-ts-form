import { z } from "zod";
import {
  addHiddenProperties,
  createFieldSchema,
  duplicateIdErrorMessage,
  HIDDEN_ID_PROPERTY,
  isSchemaWithHiddenProperties,
} from "../createFieldSchema";

describe("createFieldSchema", () => {
  it("should throw an error if an ID is used twice", () => {
    expect(() => {
      createFieldSchema(z.string(), "id");
      createFieldSchema(z.string(), "id");
    }).toThrowError(duplicateIdErrorMessage("id"));
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
