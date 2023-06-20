export function requiredValidator(
   value: string,
   message?: string
): { [key: string]: string } | null {
   let errors: { [key: string]: string } | null = null;

   if (!value) {
      errors = { required: message ?? '' };
   }

   return errors;
}

export function maxValidator(
   value: number,
   max: number,
   message?: string
): { [key: string]: string } | null {
   let errors: { [key: string]: string } | null = null;

   if (value > max) {
      errors = { max: message ?? '' };
   }

   return errors;
}

export function minValidator(
   value: number,
   min: number,
   message?: string
): { [key: string]: string } | null {
   let errors: { [key: string]: string } | null = null;

   if (value < min) {
      errors = { min: message ?? '' };
   }

   return errors;
}
