import React from 'react';
import {FieldContext} from '../providers/FieldContext';

export function useFieldContext(name: string) {
  const context = React.useContext(FieldContext);

  if (!context) {
    throw Error(
      `${name} must be called from within a FieldContextProvider... if you use this hook, the component must be rendered by @ts-react/form.`,
    );
  }

  return context;
}
