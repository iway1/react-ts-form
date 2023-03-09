import { z } from "zod";
import { createUniqueFieldSchema } from "../createFieldSchema";
import { isZodTypeEqual } from "../isZodTypeEqual";
import { RTFSupportedZodTypes } from "../supportedZodTypes";
import { combinations } from "./utils/combinations";

const parameterlessTypes = [
  z.string,
  z.number,
  z.object as () => RTFSupportedZodTypes,
  z.boolean,
];

describe("isZodTypeEqual", () => {
  it("should return true when parameterless zod types are equal to themselves", () => {
    function createTwo(t: () => RTFSupportedZodTypes) {
      return [t(), t()] as const;
    }
    const testCases = parameterlessTypes.map(createTwo);
    for (const testCase of testCases) {
      expect(isZodTypeEqual(testCase[0], testCase[1])).toStrictEqual(true);
    }
  });
  it("should not return zod types equal to other types", () => {
    for (const [a, b] of combinations(parameterlessTypes)) {
      expect(isZodTypeEqual(a(), b())).toStrictEqual(false);
    }
  });
  it("should return true that a zod type is equal to its optional", () => {
    for (const zodTypeFunction of parameterlessTypes) {
      const schemaA = zodTypeFunction();
      const schemaB = zodTypeFunction().optional();
      expect(isZodTypeEqual(schemaA, schemaB)).toStrictEqual(true);
    }
  });
  it("should return true when two enum type are equal", () => {
    expect(isZodTypeEqual(z.enum(["one"]), z.enum(["two"]))).toStrictEqual(
      true
    );
  });
  it("should return true when a is an enum and b is an optional enum", () => {
    expect(
      isZodTypeEqual(z.enum(["cool"]).optional(), z.enum(["b"]))
    ).toStrictEqual(true);
  });
  it("should return true when object nested properties have matching types.", () => {
    const A = z.object({
      fieldOne: z.string(),
      fieldTwo: z.boolean(),
      object: z.object({
        ok: z.enum(["a"]),
      }),
    });
    const B = z.object({
      fieldOne: z.string(),
      fieldTwo: z.boolean(),
      object: z.object({
        ok: z.enum(["b"]),
      }),
    });
    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  it("should return true when object nested properties have matching types regardless of property order.", () => {
    const A = z.object({
      fieldOne: z.string(),
      fieldTwo: z.boolean(),
      object: z.object({
        nokay: z.string(),
        ok: z.enum(["a"]),
      }),
    });
    const B = z.object({
      fieldTwo: z.boolean(),
      fieldOne: z.string(),

      object: z.object({
        ok: z.enum(["b"]),
        nokay: z.string(),
      }),
    });
    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  it("should return false when object nested properties have the same properties with different types", () => {
    const A = z.object({
      fieldOne: z.string(),
      fieldTwo: z.boolean(),
      object: z.object({
        ok: z.enum(["a"]),
      }),
    });
    const B = z.object({
      fieldOne: z.string(),
      fieldTwo: z.string(),
      object: z.object({
        ok: z.enum(["b"]),
      }),
    });
    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return false when objects don't have the same properties", () => {
    const A = z.object({
      fieldOne: z.string(),
      object: z.object({
        ok: z.enum(["a"]),
      }),
    });
    const B = z.object({
      fieldOne: z.string(),
      fieldTwo: z.string(),
      object: z.object({
        ok: z.enum(["b"]),
      }),
    });
    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return false when a schema created via createFieldSchema is compared to a vanilla schema of the same type", () => {
    const A = z.string();
    const B = createUniqueFieldSchema(z.string(), "b");
    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });

  it("should return false for two separate field schemas of the same base type", () => {
    const A = createUniqueFieldSchema(z.string(), "a");
    const B = createUniqueFieldSchema(z.string(), "b");

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });

  it("should return true if a field schema is compared with itself", () => {
    const A = createUniqueFieldSchema(z.string(), "a");

    expect(isZodTypeEqual(A, A)).toStrictEqual(true);
  });
  it("should return true when a nullable is compared to a nonnullable version", () => {
    const A = z.string();
    const B = A.nullable();

    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  it("should return false when an object with no properties is compared to an object with properties", () => {
    //@ts-ignore
    const A = z.object();
    const B = z.object({ field: z.string() });

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return false when B doesn't have a key that's in A", () => {
    const A = z.object({
      id: z.string(),
      nope: z.boolean(),
    });
    const B = z.object({
      id: z.string(),
    });
    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return true when an array schemas inner type are equal for primitive types", () => {
    const A = z.string().array();
    const B = z.string().array();

    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  it("should return false when an arrays inner types are not equal for primitive types.", () => {
    const A = z.string().array();
    const B = z.boolean().array();

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return true when an arrays inner type are equal for object types", () => {
    const A = z
      .object({
        one: z.string(),
      })
      .array();
    const B = z
      .object({
        one: z.string(),
      })
      .array();

    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  it("should return false when an arrays inner types are not equal for object types", () => {
    const A = z
      .object({
        a: z.string(),
      })
      .array();
    const B = z
      .object({
        a: z.boolean(),
      })
      .array();

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  //set
  it("should return false if two sets with different types are compared", () => {
    const A = z.set(z.string());
    const B = z.set(z.boolean());

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return true if two sets with the same base type are compared", () => {
    const A = z.set(z.number());
    const B = z.set(z.number());

    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  //maps
  it("should return false if two maps with different key types are compared", () => {
    const A = z.map(z.string(), z.string());
    const B = z.map(z.number(), z.string());

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return false if two maps with different value types are compared", () => {
    const A = z.map(z.string(), z.string());
    const B = z.map(z.string(), z.number());

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return true if two maps with the same key and value types are compared", () => {
    const A = z.map(z.string(), z.string());
    const B = z.map(z.string(), z.string());

    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  //records
  it("should return false if two records with different types are compared", () => {
    const A = z.record(z.string());
    const B = z.record(z.number());

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return true if two records with the same types are compared", () => {
    const A = z.record(z.string());
    const B = z.record(z.string());

    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  //tuple
  it("should return false if two tuples with different types are compared", () => {
    const A = z.tuple([z.string()]);
    const B = z.tuple([z.number()]);

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  //check length
  it("should return false if two tuples with different lengths are compared", () => {
    const A = z.tuple([z.string()]);
    const B = z.tuple([z.string(), z.string()]);

    expect(isZodTypeEqual(A, B)).toStrictEqual(false);
  });
  it("should return true if two tuples with the same types and length are compared", () => {
    const A = z.tuple([z.string(), z.number()]);
    const B = z.tuple([z.string(), z.number()]);

    expect(isZodTypeEqual(A, B)).toStrictEqual(true);
  });
  it("should return true if a unique field schema is compared with its optional", () => {
    const A = createUniqueFieldSchema(z.string(), "text");

    expect(isZodTypeEqual(A, A.optional())).toStrictEqual(true);
  });
});
