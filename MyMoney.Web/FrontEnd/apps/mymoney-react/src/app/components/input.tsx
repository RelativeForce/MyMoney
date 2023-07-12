import { FormControlProps } from '../interfaces/form-conrtol-props';

export default function Input(props: FormControlProps) {
   const errors = [];

   if (props.errors !== null) {
      for (const errorKey in props.errors) {
         errors.push(
            <div key={errorKey} className="invalid-feedback">
               <div>{props.errors[errorKey]}</div>
            </div>
         );
      }
   }

   return (
      <div className="form-group">
         <label htmlFor={props.name}>{props.labelText}</label>
         <input
            type={props.type ?? 'text'}
            name={props.name}
            className={`form-control ${props.showErrors && props.errors ? 'is-invalid' : ''}`}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            onBlurCapture={props.onChange}
            autoComplete={props.autoComplete}
         />
         {errors}
      </div>
   );
}
