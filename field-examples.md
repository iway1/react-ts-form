# Example Fields

These can be a good starting points for how to implement certain types of fields.

1. [Select](#select)

## Select

```tsx
function Select({
  options
} : {
  options: string[]
}) {
  const {field, error} = useTsController<string>();
  return (
    <>
      <select
        value={field.value?field.value:'none'}
        onChange={(e)=>{
          field.onChange(e.target.value);
        }}
      >
        {!field.value && <option value="none">Please select...</option>}
        {options.map((e) => (
          <option value={e}>{e}</option>
        ))}
      </select>
      <span>
        {error?.errorMessage && error.errorMessage}
      </span>
    <>
  );
}

const mapping = [
  // z.number() is also viable. You'll probably have to use "createUniqueFieldSchema" (since you probably already have a Text Field)
  [z.string(), DropDownSelect],
] as const;

const MyForm = z.object({
  eyeColor: z.string(),
  favoritePants: z.string(),
});

function MyPage() {
  return (
    <Form 
      schema={MyForm}
      onSubmit={()=>{}}
      renderAfter={()=><button>Submit</button>}
      props={{
        eyeColor: {
          options: ["blue", "red", "green"]
        },
        favoritePants: {
          options: ["khakis", "blue jeans"]
        }
      }}
    />
  )
}
```

