import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SESSION_LOCAL_STORAGE_KEY } from '@mymoney/common/constants';
import { IBasicResultDto, ILoginResultDto, IRegisterDto } from '@mymoney/common/api';
import { AuthenticationApi } from '../api';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { ClearSessionAction, StartSessionAction } from '../state/actions';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   constructor(private readonly authenticationApi: AuthenticationApi, private readonly store: Store<IAppState>) { }

   public login(email: string, password: string): Observable<ILoginResultDto> {
      return this.authenticationApi
         .login({ email, password })
         .pipe(map((response: ILoginResultDto) => {
            if (response.success) {
               this.store.dispatch(new StartSessionAction(response.token, response.validTo));
            }

            return response;
         }));
   }

   public register(newUserData: IRegisterDto): Observable<ILoginResultDto> {
      return this.authenticationApi
         .register(newUserData)
         .pipe(map((response: ILoginResultDto) => {

            if (response.success) {
               this.store.dispatch(new StartSessionAction(response.token, response.validTo));
            }

            return response;
         }));
   }

   public forgotPassword(email: string): Observable<void> {
      return this.authenticationApi.forgotPassword({ email });
   }

   public resetPassword(newPassword: string, userToken: string): Observable<IBasicResultDto> {
      return this.authenticationApi.resetPassword({ password: newPassword }, userToken);
   }

   public checkSession(): Observable<boolean> {
      return this.store.select(selectCurrentSession).pipe(map((session: ISessionModel | null) => {

         if (this.isValid(session)) {
            return true;
         }

         try {
            const sessionData: string | null = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);

            if (sessionData !== null) {

               const browserSession: ISessionModel = JSON.parse(sessionData);

               if (this.isValid(browserSession)) {
                  console.log('Session: Using cached session from local storage');
                  this.store.dispatch(new StartSessionAction(browserSession.token, browserSession.sessionEnd));
                  return true;
               }
            }
         } catch (error) {
            console.log(error);
         }

         this.store.dispatch(new ClearSessionAction());
         return false;
      }));
   }

   private isValid(session: ISessionModel | null): boolean {

      if (session === null) {
         return false;
      }

      const now = new Date(Date.now()).getTime();
      const validTo = Date.parse(session.sessionEnd);

      return validTo > now;
   }
}
