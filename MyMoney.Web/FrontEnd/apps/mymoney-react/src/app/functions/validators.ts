export type ValidationErrors = { [key: string]: string };

export type Validator<T> = (value: T) => ValidationErrors | null;

export function requiredValidator(message?: string): Validator<string | number | undefined> {
   return (value: string | number | undefined) => {
      let errors: ValidationErrors | null = null;

      if (value === '' || value === undefined) {
         errors = { required: message ?? '' };
      }

      return errors;
   };
}

export function maxValidator(max: number, message?: string): Validator<number> {
   return (value: number) => {
      let errors: ValidationErrors | null = null;

      if (value > max) {
         errors = { max: message ?? '' };
      }

      return errors;
   };
}

export function minValidator(min: number, message?: string): Validator<number> {
   return (value: number) => {
      let errors: ValidationErrors | null = null;

      if (value < min) {
         errors = { min: message ?? '' };
      }

      return errors;
   };
}
