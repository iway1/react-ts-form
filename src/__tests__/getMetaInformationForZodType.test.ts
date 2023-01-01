import { z } from "zod";
import {
  getMetaInformationForZodType,
  SPLIT_DESCRIPTION_SYMBOL,
} from "../getMetaInformationForZodType";

describe("getMetaInformationForZodType", () => {
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
