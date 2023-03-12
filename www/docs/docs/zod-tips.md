---
sidebar_position: 11
---

# Zod Tips

## Using Zod Refine

Zod's `.refine` method can be used to implement more advanced forms of validation, such as making sure a field takes on a certain value (like making sure a box is checked) or doing checks involving multiple fields (password / confirm password). **You must call `.refine` on the form schema itself, not on fields (unless you want the refined field to be mapped to a unique component)**:

```tsx
z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine(
  (values) => {
    return values.password === values.confirmPassword;
  },
  {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  }
);
```

This would map the message "Passwords must match!" to the `confirmPassword` field in case the passwords don't match. Note that `.refine` only validates after the base schema object passes validation.

## Zod Transform

Zod transform is not currently supported, this library assumes that the input and output type of your zod schema parsing should match.
