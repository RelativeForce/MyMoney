'use client';

import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { useState } from "react";
import Footer from './footer';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUserDto | null>({
    dateOfBirth: '',
    fullName: 'Test user',
    email: ''
  });

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
                  <button className="dropdown-item icon-dropdown-item" > {/* TODO: Logout on click */}
                    <span className="material-icons">logout</span>Logout
                  </button>
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
