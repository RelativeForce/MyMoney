export function requiredValidator(value: string, message?: string): { [key: string]: string; } | null {
    let errors: { [key: string]: string; } | null = null;

    if (!value){
      errors = { required: message ?? '' };
    }

    return errors;
}