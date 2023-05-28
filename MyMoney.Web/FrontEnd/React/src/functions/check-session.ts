import { ISessionModel } from "mymoney-common/lib/interfaces";
import { startSession, clearSession } from "@/state/sessionSlice";
import { AnyAction } from 'redux';
import { SESSION_LOCAL_STORAGE_KEY } from 'mymoney-common/lib/constants';
import { Dispatch } from "react";
import { NextRouter } from "next/router";

export function checkSession(dispatch: Dispatch<AnyAction>, router: NextRouter, session: ISessionModel | null): void {
    if (isValidSession(session)) {
        return;
    }

    try {
        const sessionData: string | null = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);

        if (sessionData !== null) {

            const browserSession: ISessionModel = JSON.parse(sessionData);

            if (isValidSession(browserSession)) {
                console.log('Session: Using cached session from local storage');
                dispatch(startSession(browserSession.token, browserSession.sessionEnd));
                return;
            }
        }
    } catch (error) {
        console.error(error);
    }

    dispatch(clearSession());
    router.push('/auth/login');
}

export function isValidSession(session: ISessionModel | null): boolean {

    if (session === null) {
        return false;
    }

    const now = new Date(Date.now()).getTime();
    const validTo = Date.parse(session.sessionEnd);

    return validTo > now;
}