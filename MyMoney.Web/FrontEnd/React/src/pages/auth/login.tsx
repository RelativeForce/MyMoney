import { HttpHelper } from "@/classess/HttpHelper";
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
import { isValidSession } from "@/functions/checkSession";
import { redirect } from "@/hooks/redirect";

export default function Login() {
  const router = useRouter();
  const session: ISessionModel | null = useSelector(selectCurrentSession);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  
  const hasValidSession = session !== null && isValidSession(session);
  redirect(router, '/', hasValidSession, [session?.token]);
  
  const updateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
    const email: string = event.target.value;
    setEmail(email);
  }

  const updatePassword: ChangeEventHandler<HTMLInputElement> = (event) => {
    const password: string = event.target.value;
    setPassword(password);
  }

  function login() {
    setSubmitted(true);

    if (loading) {
      return;
    }

    if (!email || !password)
    {
      setError('Invalid form data');
      return;
    }

    setLoading(true);
    setError(null);

    const httpHelper = new HttpHelper(null);
    const api = new AuthenticationApi(httpHelper);

    const credentials: ILoginDto = { email, password };

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

        dispatch(startSession({ token: loginResult.token, sessionEnd: loginResult.validTo }));
        void router.push('/');
      });
  }

  return (
    <>
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" className={`form-control ${submitted ? 'is-invalid' : ''}`} defaultValue={email} onChange={updateEmail}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" className={`form-control ${submitted ? 'is-invalid' : ''}`} autoComplete="current-password" defaultValue={password} onChange={updatePassword} />
        </div>
        <div className="form-group">
          <button disabled={loading} onClick={login} className="btn btn-primary">
            {loading ? (<span className="spinner-border spinner-border-sm mr-1"></span>) : ''}
            Login
          </button>
          <Link className="btn btn-link" href="/auth/register">Register</Link>
          <Link className="btn btn-link" href="/auth/forgot-password">Forgot password</Link>
        </div>
        { error !== null ? (<div className="alert alert-danger" role="alert">Login failed: {error}</div>) : '' }
      </form>
    </>
  );
}