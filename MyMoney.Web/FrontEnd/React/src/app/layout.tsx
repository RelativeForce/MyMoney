'use client';

import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { IUserDto } from 'mymoney-common/lib/api/dtos';
import { useEffect, useState } from "react";

export const metadata = {
  title: 'My Money - React',
  description: 'For all your budgeting needs',
}

export default function RootLayout({children} : {children: React.ReactNode}) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const [user, setUser] = useState<IUserDto | null>({
    dateOfBirth: '',
    fullName: 'Test user',
    email: ''
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>MyMoney</title>
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      </head>
      <body>
      <div className="sticky-top">
        {user !== null ? (
          <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
            <a className="navbar-brand">MyMoney</a> {/* TODO: Redirect to home */}
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link">Home</a> {/* TODO: Redirect to home */}
              </li>
              <li className="nav-item">
                <a className="nav-link">Transactions</a> {/* TODO: Redirect to transactions */}
              </li>
              <li className="nav-item">
                <a className="nav-link">Budgets</a> {/* TODO: Redirect to budgets */}
              </li>
              <li className="nav-item">
                <a className="nav-link">Incomes</a> {/* TODO: Redirect to incomes */}
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
                  {user.fullName}
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userMenuLink">
                  <a className="dropdown-item icon-dropdown-item"> {/* TODO: Redirect to user profile */}
                    <span className="material-icons">person</span>Profile
                  </a>
                  <a className="dropdown-item icon-dropdown-item"> {/* TODO: Redirect to change password */}
                    <span className="material-icons">vpn_key</span>Change password
                  </a>
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
          {/* TODO: Display children */}
        </div>
        {/* TODO: Footer component*/}
      </div>
        {children}
        </body>
    </html>
  )
}
