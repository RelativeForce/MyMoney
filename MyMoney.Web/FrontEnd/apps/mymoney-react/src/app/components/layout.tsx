import { IUserDto } from '@mymoney/common';
import { useSelector } from 'react-redux';
import Footer from './footer';
import { Outlet, Link } from "react-router-dom";
import { selectCurrentUser, clearSession, fetchUser, selectCurrentUserState, selectCurrentSessionToken } from '../state/session-slice';
import { useDispatch } from 'react-redux';
import { AsyncStatus, IAsyncState } from '../state/types';
import { useRedirectUnauthorisedUserToLogin } from '../hooks/user-session';
import { useEffect } from 'react';

export default function Layout() {
  useRedirectUnauthorisedUserToLogin();

  const dispatch = useDispatch<any>();
  const userState: IAsyncState<IUserDto | null> = useSelector(selectCurrentUserState);
  const token: string | null = useSelector(selectCurrentSessionToken);

  useEffect(() => {
    if (token == null || userState.status !== AsyncStatus.empty) {
      return;
    }

    dispatch(fetchUser());
  }, [token, userState]);

  const user: IUserDto | null = useSelector(selectCurrentUser);

  function logout() {
    dispatch(clearSession());
  }

  return (
    <>
      <div className="sticky-top">
        {user !== null ? (
          <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
            <Link className="navbar-brand" to="/">MyMoney</Link>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/transactions">Transactions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/budgets">Budgets</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/incomes">Incomes</Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="true">
                  {user.fullName}
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userMenuLink">
                  <Link className="dropdown-item icon-dropdown-item" to="/user/profile">
                    <span className="material-icons">person</span> Profile
                  </Link>
                  <Link className="dropdown-item icon-dropdown-item" to="/user/change-password">
                    <span className="material-icons">vpn_key</span> Change password
                  </Link>
                  <Link className="dropdown-item icon-dropdown-item" onClick={logout} to="/auth/login">
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
          <Outlet />
        </div>
        <Footer></Footer>
      </div>
    </>
  )
}
