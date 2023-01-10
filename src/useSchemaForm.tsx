import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn, DeepPartial } from "react-hook-form";
import { z, ZodEffects } from "zod";
import { UnwrapEffects } from "./typeUtilities";

export function useSchemaForm<T extends z.AnyZodObject | ZodEffects<any, any>>({
  form,
  schema,
  defaultValues,
}: {
  form?: UseFormReturn<z.infer<T>>;
  schema: T;
  defaultValues?: DeepPartial<z.infer<UnwrapEffects<T>>>;
}) {
  const { control, handleSubmit } = (() => {
    if (form) return form;
    const uf = useForm({
      resolver: zodResolver(schema),
      defaultValues,
    });
    return uf;
  })();
  return { control, handleSubmit };
}
