## Enums

Should enums be equal if they have different values (yes so users don't have to create a new mapping element every time they want a new dropdown).

Also, we should pass the enum values to the child component, that would be pretty sweet to provide options that way!

### What kind of type safety should we provide with enum values?

- We could require that component to take the values as a prop. This could be a really nice way to handle things.
- Or make it an optional property and leave it up to the developer to decide? I think it's better the enum values are required, there's no way synchronization gets easier than that...
  - Going to need a special section in the docs about enums.

## Strict

You need to have "strict": true,

## Components with required properties

If your components have a required property other than `control` or `name`, you will be required to pass them props

## Incredible Typesafety

If your component has required properties, typescript will make sure that you pass them! (Even without writing the markup for the components!)

`props` is required if any of your components have required props other than `control` or `name`.

## Stripped types

Optional, nullable, nullish are "stripped" from the type when doing type comparisions to reduce having to add repeat entries to the component mapping

## Significantly reduce cognitive load

You don't even have to remember the name of your components!
