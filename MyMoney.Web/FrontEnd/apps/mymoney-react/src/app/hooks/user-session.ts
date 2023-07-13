import { DependencyList, EffectCallback, useEffect } from 'react';
import { selectCurrentSession, setSession, clearSession } from '../state/session';
import { useDispatch, useSelector } from 'react-redux';
import { ISessionModel } from '@mymoney-common/interfaces';
import { SESSION_LOCAL_STORAGE_KEY } from '@mymoney-common/constants';
import { useNavigate } from 'react-router-dom';

/**
 * Redirects to '/auth/login' when no user is logged in.
 */
export function useRedirectUnauthorisedUserToLogin() {
   const dispatch = useDispatch<any>();
   const navigate = useNavigate();

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
      navigate('/auth/login');
   }, [session?.token]);
}

/**
 * Redirects to '/' (Home) when there is a logged in user.
 */
export function useRedirectLoggedInUserToHome() {
   const navigate = useNavigate();
   const session: ISessionModel | null = useSelector(selectCurrentSession);

   useEffect(() => {
      if (session === null || !isValidSession(session)) {
         return; // Do nothing when no user is logged in
      }

      console.log('Session: Redirect to home');
      void navigate('/');
   }, [session?.token]);
}

/**
 * A hook that ensures the given action is only performed when there is a valid user session. This is best
 * used for triggering API requests that require the user to be logged in.
 */
export function useAuthenticatedEffect(action: EffectCallback, deps?: DependencyList): void {
   const session: ISessionModel | null = useSelector(selectCurrentSession);

   useEffect(() => {
      if (session === null || !isValidSession(session)) {
         return; // Do nothing when no user is logged in
      }

      action();
   }, [session, ...(deps ?? [])]);
}

function isValidSession(session: ISessionModel | null): boolean {
   if (session === null) {
      return false;
   }

   const now = new Date(Date.now()).getTime();
   const validTo = Date.parse(session.sessionEnd);

   return validTo > now;
}
