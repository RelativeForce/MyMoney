import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClearSessionAction } from '../state/actions';
import { IAppState } from '../state/app-state';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {

   constructor(private readonly store: Store<IAppState>, private readonly router: Router) { }

   public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
      return this.store.select(selectCurrentSession).pipe(map((session: ISessionModel | null) => {

         if (this.IsValid(session)) {
            return true;
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
