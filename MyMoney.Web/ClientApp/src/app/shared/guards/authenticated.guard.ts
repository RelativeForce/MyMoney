import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { SESSION_LOCAL_STORAGE_KEY } from '../constants';
import { ClearSessionAction, StartSessionAction } from '../state/actions';
import { IAppState } from '../state/app-state';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {

   constructor(private readonly store: Store<IAppState>, private readonly router: Router) { }

   public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
      return this.store.select(selectCurrentSession).pipe(first(), map((session: ISessionModel | null) => {

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
         return this.router.createUrlTree(['/login']);
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
