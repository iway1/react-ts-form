import React from "react";
import { ComponentProps } from "react";
import { Control, useForm } from "react-hook-form";
import { z } from "zod";
import { getComponentForZodType } from "./getComponentForZodType";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DistributiveOmit,
  IndexOf,
  RequireKeysWithRequiredChildren,
} from "./typeUtilities";
import { getMetaInformationForZodType } from "./getMetaInformationForZodType";
import { UnwrapZodType } from "./unwrap";
import { RTFSupportedZodTypes } from "./supportedZodTypes";

type ReactComponentWithRequiredProps<
  Props extends { control: Control; name: string },
  ExtraProps extends Record<string, any> = {}
> = (props: Props & ExtraProps) => JSX.Element;

export type LibraryProvidedComponentProps = "control" | "name";

type ExtraRequiredPropertiesForTypes = {
  [z.ZodFirstPartyTypeKind.ZodEnum]: {
    enumValues: string[];
  };
};

type ZodTypesWithExtraProps = z.ZodEnum<any>;

type ExtraRequiredPropertiesForType<T extends RTFSupportedZodTypes> =
  T["_def"]["typeName"] extends keyof ExtraRequiredPropertiesForTypes
    ? ExtraRequiredPropertiesForTypes[T["_def"]["typeName"]]
    : {};

type TestT = ExtraRequiredPropertiesForType<z.ZodEnum<any>>;

type MappingItem =
  | readonly [
      Exclude<RTFSupportedZodTypes, ZodTypesWithExtraProps>,
      ReactComponentWithRequiredProps<any>
    ]
  | readonly [
      z.ZodEnum<any>,
      ReactComponentWithRequiredProps<
        any,
        ExtraRequiredPropertiesForType<z.ZodEnum<any>>
      >
    ];

export type FormComponentMapping = readonly MappingItem[];

export function noMatchingSchemaErrorMessage(propertyName: string) {
  return `No matching zod schema found in mapping for property ${propertyName}. Make sure there's a matching zod schema for every property.`;
}

export function createSchemaForm<Mapping extends FormComponentMapping>(
  componentMap: Mapping
) {
  return function Component<SchemaType extends z.AnyZodObject>({
    schema,
    props,
  }: // defaultValues,
  {
    schema: SchemaType;

    // defaultValues?: DeepPartial<z.infer<SchemaType>>;
  } & RequireKeysWithRequiredChildren<{
    props?: RequireKeysWithRequiredChildren<
      Partial<{
        [key in keyof z.infer<SchemaType>]: DistributiveOmit<
          Mapping[IndexOf<
            Mapping,
            readonly [
              UnwrapZodType<ReturnType<SchemaType["_def"]["shape"]>[key]>,
              any
            ]
          >] extends readonly [any, any] // I guess this tells typescript it has a second element? errors without this check.
            ? ComponentProps<
                Mapping[IndexOf<
                  Mapping,
                  readonly [
                    UnwrapZodType<ReturnType<SchemaType["_def"]["shape"]>[key]>,
                    any
                  ]
                >][1]
              >
            : never,
          LibraryProvidedComponentProps
        >;
      }>
    >;
  }>) {
    const shape = schema._def.shape();
    const { control } = useForm({
      resolver: zodResolver(schema),
      // IDK why the type errors here
      // ...(defaultValues && ({ defaultValues } as any)),
    });
    return (
      <form>
        {Object.keys(shape).map((key) => {
          const type = shape[key];
          const Component = getComponentForZodType(type, componentMap);
          if (!Component) {
            throw new Error(noMatchingSchemaErrorMessage(key));
          }
          const meta = getMetaInformationForZodType(type);

          return (
            <Component
              control={control}
              name={key}
              key={key}
              {...meta.description}
              {...(props && props[key])}
            />
          );
        })}
      </form>
    );
  };
}

function TextField(_: { control: Control<any>; name: string; extra?: string }) {
  return <input />;
}

function BooleanField(_: { control: Control<any>; name: string; req: string }) {
  return <input />;
}

function AField(_: { control: Control<any>; name: string }) {
  return <input />;
}

const map = [
  [z.string(), TextField] as const,
  [z.boolean(), BooleanField] as const,
  [z.enum(["one"]), AField] as const,
] as const;

const F = createSchemaForm(map);
F;

<F
  schema={z.object({
    id: z.string(),
    bool: z.boolean(),
    enum: z.enum(["one"]),
  })}
  props={{
    bool: {
      req: "",
    },
  }}
/>;
