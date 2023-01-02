import { z } from "zod";
import {
  getMetaInformationForZodType,
  SPLIT_DESCRIPTION_SYMBOL,
} from "../getMetaInformationForZodType";

describe("getMetaInformationForZodType", () => {
  describe("`getMetaInformationForZodType` function", () => {
    it("should get the description label if provided", () => {
      const description = "is good";
      const Schema = z.string().optional().describe(description);

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.description?.label).toStrictEqual(description);
    });
    it("should get the description label and placeholder if provided", () => {
      const label = "is good";
      const placeholder = "a placeholder";
      const Schema = z
        .string()
        .optional()
        .describe(`${label}${SPLIT_DESCRIPTION_SYMBOL}${placeholder}`);

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.description).toStrictEqual({
        label,
        placeholder,
      });
    });
    it("should have description set to undefined if one is not provided", () => {
      const Schema = z.string();

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.description).toBeUndefined();
    });
    it("should parse the description if it's called on the inner string schema", () => {
      const desc = "description";
      const Schema = z.string().describe(desc).optional();

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.description).toStrictEqual({
        label: desc,
        placeholder: undefined,
      });
    });
    it("should parse the outermost description if there are multiple on the same schema", () => {
      const descA = "description";
      const descB = "b";
      const Schema = z.string().describe(descA).optional().describe(descB);

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.description).toStrictEqual({
        label: descB,
        placeholder: undefined,
      });
    });
  });
  describe("`getEnumValues` function", () => {
    it("should return the enum values for a ZodEnum", () => {
      const Schema = z.enum(["a", "b", "c"]);

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.enumValues).toStrictEqual(["a", "b", "c"]);
    });
    it("should return the enum values for a ZodNativeEnum", () => {
      enum nativeEnum {
        a = "a",
        b = "b",
        c = "c",
      }

      const Schema = z.nativeEnum(nativeEnum);

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.enumValues).toStrictEqual(["a", "b", "c"]);
    });
    it("should return undefined if the schema is not an enum", () => {
      const Schema = z.string();

      const parsed = getMetaInformationForZodType(Schema);

      expect(parsed.enumValues).toBeUndefined();
    });
    it("should return the same values for ZodNativeEnum and ZodEnum when the enum are the same", () => {
      enum nativeEnum {
        A = "a",
        B = "b",
        C = "c",
      }

      const SchemaA = z.enum(["a", "b", "c"]);
      const SchemaB = z.nativeEnum(nativeEnum);

      const parsedA = getMetaInformationForZodType(SchemaA);
      const parsedB = getMetaInformationForZodType(SchemaB);

      expect(parsedA.enumValues).toStrictEqual(parsedB.enumValues);
    });
  });
});
