import Link from "next/link";
import { ChangeEventHandler, useState } from "react"

interface LoginState {
  submitted: boolean;
  loading: boolean;
  error: string | null;
  email: string;
  password: string;
}

const initialState: LoginState = {
  submitted: false,
  loading: false,
  error: null,
  email: '',
  password: '',
}

export default function Login() {
  const [state, updateState] = useState<LoginState>(initialState);

  const updateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
    const email: string = event.target.value;
    updateState({... state, email });
  }

  const updatePassword: ChangeEventHandler<HTMLInputElement> = (event) => {
    const password: string = event.target.value;
    updateState({... state, password });
  }

  function login() {
    updateState({... state, loading: true, error: null });

    
  }

  return (
    <>
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" className={`form-control ${state.submitted ? 'is-invalid' : ''}`} defaultValue={state.email} onChange={updateEmail}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" className={`form-control ${state.submitted ? 'is-invalid' : ''}`} autoComplete="current-password" defaultValue={state.password} onChange={updatePassword} />
        </div>
        <div className="form-group">
          <button disabled={state.loading} onClick={login} className="btn btn-primary">
            {state.loading ? (<span className="spinner-border spinner-border-sm mr-1"></span>) : ''}
            Login
          </button>
          <Link className="btn btn-link" href="/auth/register">Register</Link>
          <Link className="btn btn-link" href="/auth/forgot-password">Forgot password</Link>
        </div>
        { state.error !== null ? (<div className="alert alert-danger" role="alert">Login failed: {state.error}</div>) : '' }
      </form>
    </>
  );
}