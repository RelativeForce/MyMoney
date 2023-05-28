import { ChangeEventHandler } from "react";

export interface FormControlProps<T> {
    name: string;
    labelText: string;
    showErrors: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
    defaultValue: T;
    errors: { [key: string]: string; } | null;
    autoComplete?: string;
    type?: string;
}

export interface FormControlState<T> {
    value: T;
    errors: { [key: string]: string; } | null;
}