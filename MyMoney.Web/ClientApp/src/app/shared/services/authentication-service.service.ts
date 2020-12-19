import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILoginResultDto, IRegisterDto } from '../api';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { ClearSessionAction, StartSessionAction } from '../state/actions';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';
import { UserApi } from '../api/user.api';
import { SESSION_LOCAL_STORAGE_KEY } from '../constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   constructor(private readonly userApi: UserApi, private readonly store: Store<IAppState>) { }

   public login(email: string, password: string): Observable<ILoginResultDto> {
      return this.userApi
         .login({ email, password })
         .pipe(map((response: ILoginResultDto) => {
            if (response.success) {
               this.store.dispatch(new StartSessionAction(response.token, response.validTo));
            }

            return response;
         }));
   }

   public register(newUserData: IRegisterDto): Observable<ILoginResultDto> {
      return this.userApi
         .register(newUserData)
         .pipe(map((response: ILoginResultDto) => {

            if (response.success) {
               this.store.dispatch(new StartSessionAction(response.token, response.validTo));
            }

            return response;
         }));
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
