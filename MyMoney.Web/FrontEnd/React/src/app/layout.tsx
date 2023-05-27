'use client';

import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from "react";

export const metadata = {
  title: 'My Money - React',
  description: 'For all your budgeting needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

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
      <body>{children}</body>
    </html>
  )
}
