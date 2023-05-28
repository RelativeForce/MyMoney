import { useEffect } from 'react';
import Layout from '../components/layout';
import type { AppProps } from 'next/app';
import '../globals.css'
import 'bootstrap/dist/css/bootstrap.css'

export const metadata = {
    title: 'My Money - React',
    description: 'For all your budgeting needs',
}

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}