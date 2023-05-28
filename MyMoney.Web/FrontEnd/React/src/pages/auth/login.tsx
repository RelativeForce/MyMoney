import { HttpHelper } from "@/classess/http-helper";
import Link from "next/link";
import { ChangeEventHandler, useState } from "react"
import { useDispatch } from 'react-redux';
import { AuthenticationApi } from 'mymoney-common/lib/api';
import { ILoginDto, ILoginResultDto } from 'mymoney-common/lib/api/dtos';
import { ISessionModel } from 'mymoney-common/lib/interfaces';
import { first, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectCurrentSession, startSession } from "@/state/sessionSlice";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isValidSession } from "@/functions/check-session";
import { redirect } from "@/hooks/redirect";
import TextInput from "@/components/text-input";
import { FormControlState } from "@/interfaces/form-conrtol-props";
import { requiredValidator } from "@/functions/validators";

export default function Login() {
  const router = useRouter();
  const session: ISessionModel | null = useSelector(selectCurrentSession);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailState, setEmailState] = useState<FormControlState<string>>({ value: '', errors: null });
  const [passwordState, setPasswordState] = useState<FormControlState<string>>({ value: '', errors: null });
  const dispatch = useDispatch();

  const hasValidSession = session !== null && isValidSession(session);
  redirect(router, '/', hasValidSession, [session?.token]);

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

  function login() {
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

    const httpHelper = new HttpHelper(null);
    const api = new AuthenticationApi(httpHelper);

    const credentials: ILoginDto = { email: emailState.value, password: passwordState.value };

    api.login(credentials)
      .pipe(
        first(),
        catchError((error) => {
          setError('Unknown error');
          console.error(error);
          return of(null)
        }),
      )
      .subscribe((loginResult: ILoginResultDto | null) => {
        if (!loginResult) {
          return;
        }

        dispatch(startSession(loginResult.token, loginResult.validTo));
        void router.push('/');
      });
  }

  return (
    <>
      <h2>Login</h2>
      <form>
        <TextInput
          name="email"
          labelText="Email"
          showErrors={submitted}
          onChange={updateEmail}
          defaultValue={emailState.value}
          errors={emailState.errors}
        />
        <TextInput
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
          <button disabled={loading} type="button" onClick={login} className="btn btn-primary">
            {loading ? (<span className="spinner-border spinner-border-sm mr-1"></span>) : ''}
            Login
          </button>
          <Link className="btn btn-link" href="/auth/register">Register</Link>
          <Link className="btn btn-link" href="/auth/forgot-password">Forgot password</Link>
        </div>
        {error !== null ? (<div className="alert alert-danger" role="alert">Login failed: {error}</div>) : ''}
      </form>
    </>
  );
}