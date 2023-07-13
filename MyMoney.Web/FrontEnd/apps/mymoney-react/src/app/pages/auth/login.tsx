import { Link } from 'react-router-dom';
import { ChangeEventHandler, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ILoginDto } from '@mymoney-common/api';
import { login } from '../../state/session';
import Input from '../../components/input';
import { requiredValidator } from '../../functions/validators';
import { useRedirectLoggedInUserToHome } from '../../hooks/user-session';
import { useValidatedState } from '../../hooks/validation';

export default function Login() {
   useRedirectLoggedInUserToHome();

   const [submitted, setSubmitted] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [emailState, setEmailState] = useValidatedState<string>('', [requiredValidator('Email is required')]);
   const [passwordState, setPasswordState] = useValidatedState<string>('', [requiredValidator('Password is required')]);
   const dispatch = useDispatch<any>();

   const updateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
      setEmailState(event.target.value);
   };

   const updatePassword: ChangeEventHandler<HTMLInputElement> = (event) => {
      setPasswordState(event.target.value);
   };

   const loginClicked = () => {
      setSubmitted(true);

      if (loading) {
         return;
      }

      const emailErrors = setEmailState(emailState.value);
      const passwordErrors = setPasswordState(passwordState.value);

      if (emailErrors || passwordErrors) {
         return;
      }

      setLoading(true);
      setError(null);

      const credentials: ILoginDto = {
         email: emailState.value,
         password: passwordState.value,
      };

      try {
         dispatch(login(credentials)).unwrap();
      } catch (error: any) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   };

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
                  {loading ? <span className="spinner-border spinner-border-sm mr-1"></span> : ''}
                  Login
               </button>
               <Link className="btn btn-link" to="/auth/register">
                  Register
               </Link>
               <Link className="btn btn-link" to="/auth/forgot-password">
                  Forgot password
               </Link>
            </div>
            {error !== null ? (
               <div className="alert alert-danger" role="alert">
                  Login failed: {error}
               </div>
            ) : (
               ''
            )}
         </form>
      </>
   );
}
