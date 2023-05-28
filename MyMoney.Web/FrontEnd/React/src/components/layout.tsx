'use client';

import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { useSelector } from 'react-redux';
import Footer from './footer';
import Link from 'next/link';
import { selectCurrentSession, selectCurrentUser, clearSession, fetchUser, selectCurrentUserState } from '@/state/session-slice';
import { ISessionModel } from 'mymoney-common/lib/interfaces';
import { checkSession } from '@/functions/check-session';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AsyncStatus, IUserState } from '@/state/types';

export default function Layout({ children }: { children: React.ReactNode }) {
  const session: ISessionModel | null = useSelector(selectCurrentSession);
  const userState: IUserState = useSelector(selectCurrentUserState);

  const dispatch = useDispatch<any>();
  const router = useRouter();

  useEffect(() => checkSession(dispatch, router, session), [session?.token]);

  useEffect(() => {
    if (!session?.token || userState.status !== AsyncStatus.empty) {
      return;
    }

    dispatch(fetchUser(session.token));
  }, [session?.token, dispatch]);

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
