import { FormControlProps } from "../interfaces/form-conrtol-props";

export default function InlineInput(props: FormControlProps) {
    const errors = [];

    if (props.errors !== null) {
        for (const errorKey in props.errors) {
            errors.push((
                <div key={errorKey} className="invalid-feedback">
                    <div>{props.errors[errorKey]}</div>
                </div>
            ));
        }
    }

    return (
        <>
            <div className="input-group mb-3 pr-2">
                <div className="input-group-prepend">
                    <span className="input-group-text">{props.labelText}</span>
                </div>
                <input
                    type={props.type ?? 'text'}
                    name={props.name}
                    className={`form-control ${props.showErrors && props.errors ? 'is-invalid' : ''}`}
                    defaultValue={props.defaultValue}
                    onChange={props.onChange}
                    autoComplete={props.autoComplete}
                />
                {errors}
            </div>
        </>
    );
}