'use client';

import { useState } from 'react'
import { IUserDto } from 'mymoney-common/lib/api/dtos';

export default function Home() {
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
    </>
  )
}
