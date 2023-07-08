import { useState } from 'react';
import { Validator, ValidationErrors } from '../functions/validators';

export interface ValidatedState<T> {
   value: T;
   errors: { [key: string]: string } | null;
}

export type ValidatedStateDispatch<T> = (value: T) => ValidationErrors | null;

export function useValidatedState<T>(
   initialValue: T,
   validators: Validator<T>[]
): [ValidatedState<T>, ValidatedStateDispatch<T>] {
   const [currentState, setState] = useState<ValidatedState<T>>({
      value: initialValue,
      errors: null,
   });

   const setValidatedValue = (value: T) => {
      let errors: ValidationErrors | null = null;

      for (const validator of validators) {
         const validatorErrors = validator(value);

         if (validatorErrors === null) {
            continue;
         }

         if (errors === null) {
            errors = validatorErrors;
            continue;
         }

         errors = { ...errors, ...validatorErrors };
      }

      setState({ value, errors });

      return errors;
   };

   return [currentState, setValidatedValue];
}
