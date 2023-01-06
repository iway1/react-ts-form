import React from 'react';
import {Control} from 'react-hook-form';

export const FieldContext = React.createContext<null | {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  enumValues?: string[];
}>(null);
