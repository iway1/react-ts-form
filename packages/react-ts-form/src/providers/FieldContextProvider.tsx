import React from 'react';
import {Control} from 'react-hook-form';

import {FieldContext} from './FieldContext';

export function FieldContextProvider({
  name,
  control,
  children,
  label,
  placeholder,
  enumValues,
}: {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  enumValues?: string[];
  children: React.ReactNode;
}) {
  return (
    <FieldContext.Provider
      value={{control, name, label, placeholder, enumValues}}
    >
      {children}
    </FieldContext.Provider>
  );
}
