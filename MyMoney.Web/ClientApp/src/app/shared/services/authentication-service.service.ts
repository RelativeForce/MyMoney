import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ILoginResultDto, IRegisterDto } from '../api';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { ClearSessionAction, StartSessionAction } from '../state/actions';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';
import { Router } from '@angular/router';
import { UserApi } from '../api/user.api';
import { LOGIN_PAGE_PATH, SESSION_LOCAL_STORAGE_KEY } from '../constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   constructor(private readonly userApi: UserApi, private readonly store: Store<IAppState>, private readonly router: Router) { }

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

   public isLoggedIn(): Observable<boolean> {
      return this.store.select(selectCurrentSession).pipe(map((s: ISessionModel | null) => s !== null));
   }

   public logout(): void {
      this.store.dispatch(new ClearSessionAction());
      this.router.navigate(['/' + LOGIN_PAGE_PATH]);
   }

   public checkSession(): Observable<boolean> {
      return this.store.select(selectCurrentSession).pipe(map((session: ISessionModel | null) => {

         if (this.IsValid(session)) {
            return true;
         }

         try {
            const sessionData: string | null = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);

            if (sessionData !== null) {

               const browserSession: ISessionModel = JSON.parse(sessionData);

               if (this.IsValid(browserSession)) {
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

   private IsValid(session: ISessionModel | null): boolean {

      if (session === null) {
         return false;
      }

      const now = new Date(Date.now()).getTime();
      const validTo = Date.parse(session.sessionEnd);

      return validTo > now;
   }
}
