import { ChangeEventHandler } from 'react';

export interface FormControlProps {
   name: string;
   labelText: string;
   showErrors: boolean;
   onChange: ChangeEventHandler<HTMLInputElement>;
   defaultValue: string;
   errors: { [key: string]: string } | null;
   autoComplete?: string;
   type?: string;
}

export interface FormControlState<T> {
   value: T;
   errors: { [key: string]: string } | null;
}
