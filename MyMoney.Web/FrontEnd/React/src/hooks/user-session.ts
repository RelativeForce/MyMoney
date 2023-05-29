import { DependencyList, useEffect } from "react"
import { selectCurrentSessionToken, selectCurrentSession } from "@/state/session-slice";
import { useDispatch, useSelector } from 'react-redux';
import { ISessionModel } from "mymoney-common/lib/interfaces";
import { setSession, clearSession } from "@/state/session-slice";
import { SESSION_LOCAL_STORAGE_KEY } from 'mymoney-common/lib/constants';
import { useRouter } from "next/router";

export function useUserSession(operation: (sessionToken: string) => (void | (() => void)), deps?: DependencyList) {
    const sessionToken: string | null = useSelector(selectCurrentSessionToken);

    useEffect(
        () => {
            if (!sessionToken) {
                return; // Do nothing when no user is logged in
            }

            return operation(sessionToken)
        },
        [sessionToken, ...(deps ?? [])]
    );
}


export function redirectUnauthorisedUserToLogin() {
    const dispatch = useDispatch<any>();
    const router = useRouter();

    const session: ISessionModel | null = useSelector(selectCurrentSession);

    useEffect(() => {
        if (isValidSession(session)) {
            return; // Do nothing when user session is valid
        }

        try {
            const sessionData: string | null = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);

            if (sessionData !== null) {

                const browserSession: ISessionModel = JSON.parse(sessionData);

                if (isValidSession(browserSession)) {
                    console.log('Session: Using cached session from local storage');
                    dispatch(setSession(browserSession.token, browserSession.sessionEnd));
                    return;
                }
            }
        } catch (error) {
            console.error(error);
        }

        dispatch(clearSession());
        console.log('Session: Redirect to login');
        router.push('/auth/login');
    }, [session?.token]);
}

export function redirectLoggedInUserToHome() {
    const router = useRouter();
    const session: ISessionModel | null = useSelector(selectCurrentSession);

    useEffect(() => {
        if (session === null || !isValidSession(session)) {
            return; // Do nothing when no user is logged in
        }

        console.log('Session: Redirect to home');
        void router.push('/');
    }, [session?.token]);
}

 function isValidSession(session: ISessionModel | null): boolean {

    if (session === null) {
        return false;
    }

    const now = new Date(Date.now()).getTime();
    const validTo = Date.parse(session.sessionEnd);

    return validTo > now;
}