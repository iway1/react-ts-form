import { z } from "zod";
import React from "react";
import { createTsForm } from "../createSchemaForm";

describe("unwrap types", () => {
  it("should have the correct types for nullable, optional, and nullish", () => {
    function TextField(_: { one: string }) {
      return <div />;
    }
    const mapping = [[z.string(), TextField]] as const;

    const Form = createTsForm(mapping);

    <Form
      onSubmit={(data) => {
        data.nullableString;
      }}
      schema={z.object({
        nullableString: z.string().nullable(),
        optionalString: z.string().optional(),
        nullishString: z.string().nullish(),
      })}
      props={{
        nullableString: {
          one: "One",
        },
        optionalString: {
          one: "One",
        },
        nullishString: {
          one: "One",
        },
      }}
    />;
  });
  it("should have the correct types for nullable optional", () => {
    function TextField(_: { one: string }) {
      return <div />;
    }
    const mapping = [[z.string(), TextField]] as const;

    const Form = createTsForm(mapping);

    <Form
      onSubmit={(data) => {
        data.optionalNullableString;
        data.nullableOptionalString;
      }}
      schema={z.object({
        optionalNullableString: z.string().optional().nullable(),
        nullableOptionalString: z.string().nullable().optional(),
      })}
      props={{
        optionalNullableString: {
          one: "One",
        },
        nullableOptionalString: {
          one: "One",
        },
      }}
    />;
  });
});
