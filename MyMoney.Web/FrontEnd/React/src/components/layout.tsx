'use client';

import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { useSelector } from 'react-redux';
import Footer from './footer';
import Link from 'next/link';
import { selectCurrentSession, selectCurrentUser, clearSession, setUser } from '@/state/sessionSlice';
import { ISessionModel } from 'mymoney-common/lib/interfaces';
import { checkSession } from '@/functions/checkSession';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { HttpHelper } from '@/classess/HttpHelper';
import { UserApi } from 'mymoney-common/lib/api';
import { useSessionToken } from '@/hooks/useSessionToken';
import { first, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export default function Layout({ children }: { children: React.ReactNode }) {
  const session: ISessionModel | null = useSelector(selectCurrentSession);

  const dispatch = useDispatch();
  const router = useRouter();

  useSessionToken(() => checkSession(dispatch, router, session));

  useSessionToken(() => {
    const httpHelper = new HttpHelper(session?.token ?? null);
    const api = new UserApi(httpHelper);

    api.currentUserDetails()
      .pipe(
        first(),
        catchError((error) => {
          console.error(error);
          return of(null)
        }),
      )
      .subscribe((user: IUserDto | null) => {
        if (!user) {
          return;
        }

        dispatch(setUser(user));
        void router.push('/');
      });
  });

  const user: IUserDto | null = useSelector(selectCurrentUser);

  function logout() {
    dispatch(clearSession());
  }

  return (
    <>
      <div className="sticky-top">
        {user !== null ? (
          <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
            <Link className="navbar-brand" href="/">MyMoney</Link>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" href="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/transactions">Transactions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/budgets">Budgets</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/incomes">Incomes</Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
                  {user.fullName}
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userMenuLink">
                  <Link className="dropdown-item icon-dropdown-item" href="/user/profile">
                    <span className="material-icons">person</span> Profile
                  </Link>
                  <Link className="dropdown-item icon-dropdown-item" href="/user/change-password">
                    <span className="material-icons">vpn_key</span> Change password
                  </Link>
                  <Link className="dropdown-item icon-dropdown-item" onClick={logout} href="/auth/login">
                    <span className="material-icons">logout</span> Logout
                  </Link>
                </div>
              </li>
            </ul>
          </nav>
        ) : ''}
      </div>
      <div className="jumbotron">
        <div className="container">
          {children}
        </div>
        <Footer></Footer>
      </div>
    </>
  )
}
