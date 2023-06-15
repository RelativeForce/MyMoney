import { Link } from "react-router-dom";
import { ChangeEventHandler, useState } from "react"
import { useDispatch } from 'react-redux';
import { ILoginDto } from '@mymoney-common/api';
import { login } from "../../state/session-slice";
import Input from "../../components/input";
import { FormControlState } from "../../interfaces/form-conrtol-props";
import { requiredValidator } from "../../functions/validators";
import { useRedirectLoggedInUserToHome } from "../../hooks/user-session";

export default function Login() {
  useRedirectLoggedInUserToHome();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailState, setEmailState] = useState<FormControlState>({ value: '', errors: null });
  const [passwordState, setPasswordState] = useState<FormControlState>({ value: '', errors: null });
  const dispatch = useDispatch<any>();

  const updateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
    const email: string = event.target.value;

    const errors = requiredValidator(email, 'Email is required');
    setEmailState({ value: email, errors });
  }

  const updatePassword: ChangeEventHandler<HTMLInputElement> = (event) => {
    const password: string = event.target.value;

    const errors = requiredValidator(password, 'Password is required');
    setPasswordState({ value: password, errors });
  }

  const loginClicked = ()=> {
    setSubmitted(true);

    if (loading) {
      return;
    }

    const emailErrors = requiredValidator(emailState.value, 'Email is required');
    setEmailState({ value: emailState.value, errors: emailErrors });

    const passwordErrors = requiredValidator(passwordState.value, 'Password is required');
    setPasswordState({ value: passwordState.value, errors: passwordErrors });

    if (emailErrors || passwordErrors) {
      return;
    }

    setLoading(true);
    setError(null);

    const credentials: ILoginDto = { email: emailState.value, password: passwordState.value };

    try {
      dispatch(login(credentials)).unwrap();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Login</h2>
      <form>
        <Input
          name="email"
          labelText="Email"
          showErrors={submitted}
          onChange={updateEmail}
          defaultValue={emailState.value}
          errors={emailState.errors}
        />
        <Input
          name="password"
          labelText="Password"
          showErrors={submitted}
          onChange={updatePassword}
          defaultValue={passwordState.value}
          errors={passwordState.errors}
          autoComplete="current-password"
          type="password"
        />
        <div className="form-group">
          <button disabled={loading} type="button" onClick={loginClicked} className="btn btn-primary">
            {loading ? (<span className="spinner-border spinner-border-sm mr-1"></span>) : ''}
            Login
          </button>
          <Link className="btn btn-link" to="/auth/register">Register</Link>
          <Link className="btn btn-link" to="/auth/forgot-password">Forgot password</Link>
        </div>
        {error !== null ? (<div className="alert alert-danger" role="alert">Login failed: {error}</div>) : ''}
      </form>
    </>
  );
}