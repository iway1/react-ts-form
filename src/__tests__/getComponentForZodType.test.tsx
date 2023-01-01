import React from "react";
import { FormComponentMapping } from "../createSchemaForm";
import { z } from "zod";
import { getComponentForZodType } from "../getComponentForZodType";

function TextField(_: {}) {
  return <input />;
}

function BooleanField(_: {}) {
  return <input />;
}

function EnumField(_: {}) {
  return <input />;
}

const mapping: FormComponentMapping = [
  [z.string(), TextField],
  [z.boolean(), BooleanField],
  [z.enum(["One"]), EnumField],
];
describe("getComponentForZodType", () => {
  it("should get the appropriate component for the zod type based on the mapping", () => {
    for (const mappingElement of mapping) {
      expect(getComponentForZodType(mappingElement[0], mapping)).toStrictEqual(
        mappingElement[1]
      );
    }
  });
  it("should return undefined if there is no matching zod type", () => {
    expect(getComponentForZodType(z.number(), mapping)).toStrictEqual(
      undefined
    );
  });
});
